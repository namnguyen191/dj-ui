import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UIElementTemplateService } from '@dj-ui/core';
import type { ZSimpleTextUIETemplate } from '@dj-ui/prime-ng-ext/simple-text';
import { firstValueFrom, from, map, Observable, switchMap, tap } from 'rxjs';

import type { AppUIElementTemplate, CreateAppUIElementTemplate, TimeStamp } from '../app-template';
import { mockUIElementTemplates } from '../mock-templates';
import { AppIdbService } from './app-idb.service';

export type CreateAppUIElementTemplatePayload = Omit<AppUIElementTemplate, keyof TimeStamp>;

export type UpdateAppUIElementTemplatePayload = CreateAppUIElementTemplatePayload;

export const getErrorTemplate = (
  id: string
): CreateAppUIElementTemplate<ZSimpleTextUIETemplate> => ({
  id,
  name: 'UI Element error template',
  createdAt: new Date().toISOString(),
  description:
    'Use this template to display an error for when we failed to fetch the actual template',
  type: 'SIMPLE_TEXT',
  options: {
    textBlocks: [
      {
        text: 'Something went wrong',
        type: 'title',
      },
      {
        text: 'We could not fetch this UI right now. Please refresh your browser or try again later',
        type: 'paragraph',
      },
    ],
  },
});

@Injectable({
  providedIn: 'root',
})
export class UIElementTemplateAPIService {
  readonly #uiElementTemplateService = inject(UIElementTemplateService);

  readonly #idbService = inject(AppIdbService);
  readonly #uiElementTemplateRepo$ = from(this.#idbService.getRepo('appUIElementTemplates'));

  getAllUIElementTemplates = (): Observable<AppUIElementTemplate[]> => {
    return this.#uiElementTemplateRepo$.pipe(
      switchMap((repo) => {
        return repo.getAll();
      })
    );
  };

  createUIElementTemplate = (
    payload: CreateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    const createdTemplate: AppUIElementTemplate = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    return this.#uiElementTemplateRepo$.pipe(switchMap((repo) => repo.createOne(createdTemplate)));
  };

  updateUIElementTemplate = (
    payload: UpdateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    return this.fetchUIElementTemplate(payload.id).pipe(
      switchMap((existingTemplate) => {
        const updatedTemplate: AppUIElementTemplate = {
          ...payload,
          createdAt: existingTemplate.createdAt,
          updatedAt: new Date().toISOString(),
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

  fetchUIElementTemplate(id: string): Observable<AppUIElementTemplate> {
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

  async resetExampleTemplates(): Promise<void> {
    const repo = await firstValueFrom(this.#uiElementTemplateRepo$);
    for (const template of mockUIElementTemplates) {
      await repo.deleteOne(template.id);
      const templateWithCreatedAt = {
        ...template,
        createdAt: new Date().toISOString(),
      } as AppUIElementTemplate;
      await repo.createOne(templateWithCreatedAt);
    }
  }
}
