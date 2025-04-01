import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LayoutTemplateService } from '@dj-ui/core';
import { firstValueFrom, from, map, Observable, switchMap, tap } from 'rxjs';

import type { AppLayoutTemplate } from '../shared/dj-ui-app-template';
import { mockLayoutTemplates } from '../utils/mock-templates';
import { IdbService } from './idb.service';
import {
  type CreateAppLayoutTemplatePayload,
  LayoutTemplatesAPIService,
  type UpdateAppLayoutTemplatePayload,
} from './layout-templates-api.service';

@Injectable()
export class LayoutTemplatesLocalAPIService extends LayoutTemplatesAPIService {
  readonly #layoutTemplateService = inject(LayoutTemplateService);

  readonly #idbService = inject(IdbService);
  readonly #layoutTemplateRepo$ = from(this.#idbService.getRepo('layoutTemplates'));

  override getAllLayoutTemplates = (): Observable<AppLayoutTemplate[]> => {
    return this.#layoutTemplateRepo$.pipe(switchMap((repo) => repo.getAll()));
  };

  override createLayoutTemplate = (
    payload: CreateAppLayoutTemplatePayload
  ): Observable<AppLayoutTemplate> => {
    const createdTemplate: AppLayoutTemplate = {
      ...payload,
      createdAt: new Date().toUTCString(),
    };

    return this.#layoutTemplateRepo$.pipe(switchMap((repo) => repo.createOne(createdTemplate)));
  };

  override updateLayoutTemplate = (
    payload: UpdateAppLayoutTemplatePayload
  ): Observable<AppLayoutTemplate> => {
    return this.fetchLayoutTemplate(payload.id).pipe(
      switchMap((existingTemplate) => {
        const updatedTemplate: AppLayoutTemplate = {
          ...payload,
          createdAt: existingTemplate.createdAt,
          updatedAt: new Date().toUTCString(),
        };

        return this.#layoutTemplateRepo$.pipe(
          switchMap((repo) => repo.updateOne(updatedTemplate)),
          tap({
            next: () => {
              this.#layoutTemplateService.updateOrRegisterTemplate(updatedTemplate);
            },
          })
        );
      })
    );
  };

  override fetchLayoutTemplate(id: string): Observable<AppLayoutTemplate> {
    return this.#layoutTemplateRepo$.pipe(
      switchMap((repo) => repo.getOne(id)),
      map((layoutTemplate) => {
        if (layoutTemplate === null) {
          throw new HttpErrorResponse({
            error: `Layout template with ID ${id} does not exist in indexed db`,
            status: 404,
          });
        }

        return layoutTemplate;
      })
    );
  }

  async resetTemplates(): Promise<void> {
    const repo = await firstValueFrom(this.#layoutTemplateRepo$);
    await repo.clearAll();
    for (const template of mockLayoutTemplates) {
      const templateWithCreatedAt = {
        ...template,
        createdAt: new Date().toUTCString(),
      } as AppLayoutTemplate;
      await repo.createOne(templateWithCreatedAt);
    }
  }
}
