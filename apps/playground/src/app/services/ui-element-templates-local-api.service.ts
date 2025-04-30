import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UIElementTemplateService } from '@dj-ui/core';
import { firstValueFrom, from, map, Observable, switchMap, tap } from 'rxjs';

import type { AppUIElementTemplate } from '../shared/dj-ui-app-template';
import { mockUIElementTemplates } from '../utils/mock-templates';
import { AppIdbService } from './app-idb.service';
import {
  type CreateAppUIElementTemplatePayload,
  UIElementTemplatesAPIService,
  type UpdateAppUIElementTemplatePayload,
} from './ui-element-templates-api.service';

@Injectable()
export class UIElementTemplatesLocalAPIService extends UIElementTemplatesAPIService {
  readonly #uiElementTemplateService = inject(UIElementTemplateService);

  readonly #idbService = inject(AppIdbService);
  readonly #uiElementTemplateRepo$ = from(this.#idbService.getRepo('uiElementTemplates'));

  override getAllUIElementTemplates = (): Observable<AppUIElementTemplate[]> => {
    return this.#uiElementTemplateRepo$.pipe(switchMap((repo) => repo.getAll()));
  };

  override createUIElementTemplate = (
    payload: CreateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    const createdTemplate: AppUIElementTemplate = {
      ...payload,
      createdAt: new Date().toUTCString(),
    };

    return this.#uiElementTemplateRepo$.pipe(switchMap((repo) => repo.createOne(createdTemplate)));
  };

  override updateUIElementTemplate = (
    payload: UpdateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    return this.fetchUIElementTemplate(payload.id).pipe(
      switchMap((existingTemplate) => {
        const updatedTemplate: AppUIElementTemplate = {
          ...payload,
          createdAt: existingTemplate.createdAt,
          updatedAt: new Date().toUTCString(),
        };

        return this.#uiElementTemplateRepo$.pipe(
          switchMap((repo) => repo.updateOne(updatedTemplate)),
          tap({
            next: () => {
              this.#uiElementTemplateService.updateOrRegisterTemplate(updatedTemplate);
            },
          })
        );
      })
    );
  };

  override fetchUIElementTemplate(id: string): Observable<AppUIElementTemplate> {
    return this.#uiElementTemplateRepo$.pipe(
      switchMap((repo) => repo.getOne(id)),
      map((uiElementTemplate) => {
        if (uiElementTemplate === null) {
          throw new HttpErrorResponse({
            error: `UI element template with ID ${id} does not exist in indexed db`,
            status: 404,
          });
        }

        return uiElementTemplate;
      })
    );
  }

  async resetTemplates(): Promise<void> {
    const repo = await firstValueFrom(this.#uiElementTemplateRepo$);
    await repo.clearAll();
    for (const template of mockUIElementTemplates) {
      const templateWithCreatedAt = {
        ...template,
        createdAt: new Date().toUTCString(),
      } as AppUIElementTemplate;
      await repo.createOne(templateWithCreatedAt);
    }
  }
}
