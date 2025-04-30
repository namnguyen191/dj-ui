import { inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { logError } from '../../utils/logging';
import { type CoreEvent, EventsService } from '../events-and-actions/events.service';
import type { ConfigWithStatus } from './shared-types';

export type TemplateId = string;
export type Template = {
  id: TemplateId;
};
export type MissingTemplateEvent = Extract<
  CoreEvent,
  'MISSING_REMOTE_RESOURCE_TEMPLATE' | 'MISSING_UI_ELEMENT_TEMPLATE'
>;

export abstract class BaseTemplateService<T extends Template> {
  protected abstract missingTemplateEvent: MissingTemplateEvent;

  readonly #eventsService = inject(EventsService);

  #templateSubjectMap: Record<TemplateId, BehaviorSubject<ConfigWithStatus<T>>> = {};

  startRegisteringTemplate(id: TemplateId): void {
    const existingTemplateSubject = this.#templateSubjectMap[id];
    const registeringTemplate: ConfigWithStatus<T> = {
      id,
      status: 'loading',
      config: null,
    };
    if (!existingTemplateSubject) {
      const newTemplateSubject = new BehaviorSubject<ConfigWithStatus<T>>(registeringTemplate);
      this.#templateSubjectMap[id] = newTemplateSubject;
      return;
    }

    existingTemplateSubject.next(registeringTemplate);
  }

  registerTemplate(template: T): void {
    const templateId = template.id;
    const existingTemplateSubject = this.#templateSubjectMap[templateId];
    const registeredTemplate: ConfigWithStatus<T> = {
      id: templateId,
      status: 'loaded',
      config: template,
    };
    if (existingTemplateSubject) {
      if (existingTemplateSubject.getValue().status === 'loaded') {
        logError(
          `Template with id of "${templateId}" has already been register. Please update it instead`
        );
        return;
      }

      existingTemplateSubject.next(registeredTemplate);
      return;
    }

    const newTemplateSubject = new BehaviorSubject<ConfigWithStatus<T>>(registeredTemplate);

    this.#templateSubjectMap[templateId] = newTemplateSubject;
  }

  getTemplate(id: TemplateId): Observable<ConfigWithStatus<T>> {
    const existingTemplateSubject = this.#templateSubjectMap[id];
    if (!existingTemplateSubject) {
      this.#eventsService.emitEvent({
        type: this.missingTemplateEvent,
        payload: {
          id,
        },
      });
      const newTemplateSubject = new BehaviorSubject<ConfigWithStatus<T>>({
        id,
        status: 'missing',
        config: null,
      });
      this.#templateSubjectMap[id] = newTemplateSubject;
      return newTemplateSubject.asObservable();
    }
    return existingTemplateSubject.asObservable();
  }

  updateTemplate(updatedTemplate: T): void {
    const updatedTemplateId = updatedTemplate.id;
    const existingTemplateSubject = this.#templateSubjectMap[updatedTemplateId];
    const existingTemplateStatus = existingTemplateSubject?.getValue().status;

    if (!existingTemplateSubject || !(existingTemplateStatus === 'loaded')) {
      logError(
        `Template with id of "${updatedTemplateId}" has not been register. Please register it instead`
      );
      return;
    }

    existingTemplateSubject.next({
      id: updatedTemplateId,
      status: 'loaded',
      config: updatedTemplate,
    });
  }

  updateOrRegisterTemplate(template: T): void {
    if (this.#templateSubjectMap[template.id]) {
      this.updateTemplate(template);
    } else {
      this.registerTemplate(template);
    }
  }
}
