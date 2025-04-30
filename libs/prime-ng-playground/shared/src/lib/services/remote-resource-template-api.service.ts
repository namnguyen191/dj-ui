import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RemoteResourceTemplateService } from '@dj-ui/core';
import { firstValueFrom, from, map, Observable, switchMap, tap } from 'rxjs';

import type { AppRemoteResourceTemplate, TimeStamp } from '../app-template';
import { mockRemoteResourceTemplates } from '../mock-templates';
import { AppIdbService } from './app-idb.service';

export type CreateAppRemoteResourceTemplatePayload = Omit<
  AppRemoteResourceTemplate,
  keyof TimeStamp
>;

export type UpdateAppRemoteResourceTemplatePayload = CreateAppRemoteResourceTemplatePayload;

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceTemplateAPIService {
  readonly #remoteResourceTemplateService = inject(RemoteResourceTemplateService);

  readonly #idbService = inject(AppIdbService);
  readonly #remoteResourceTemplateRepo$ = from(
    this.#idbService.getRepo('appRemoteResourceTemplates')
  );

  getAllRemoteResourceTemplates = (): Observable<AppRemoteResourceTemplate[]> => {
    return this.#remoteResourceTemplateRepo$.pipe(
      switchMap((repo) => {
        return repo.getAll();
      })
    );
  };

  createRemoteResourceTemplate = (
    payload: CreateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    const createdTemplate: AppRemoteResourceTemplate = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    return this.#remoteResourceTemplateRepo$.pipe(
      switchMap((repo) => repo.createOne(createdTemplate))
    );
  };

  updateRemoteResourceTemplate = (
    payload: UpdateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    return this.fetchRemoteResourceTemplate(payload.id).pipe(
      switchMap((existingTemplate) => {
        const updatedTemplate: AppRemoteResourceTemplate = {
          ...payload,
          createdAt: existingTemplate.createdAt,
          updatedAt: new Date().toISOString(),
        };

        return this.#remoteResourceTemplateRepo$.pipe(
          switchMap((repo) => repo.updateOne(updatedTemplate)),
          tap({
            next: () => {
              this.#remoteResourceTemplateService.updateOrRegisterTemplate(updatedTemplate);
            },
          })
        );
      })
    );
  };

  fetchRemoteResourceTemplate(id: string): Observable<AppRemoteResourceTemplate> {
    return this.#remoteResourceTemplateRepo$.pipe(
      switchMap((repo) => repo.getOne(id)),
      map((remoteResourceTemplate) => {
        if (remoteResourceTemplate === null) {
          throw new HttpErrorResponse({
            error: `Remote resource template with ID ${id} does not exist in indexed db`,
            status: 404,
          });
        }

        return remoteResourceTemplate;
      })
    );
  }

  async resetExampleTemplates(): Promise<void> {
    const repo = await firstValueFrom(this.#remoteResourceTemplateRepo$);
    for (const template of mockRemoteResourceTemplates) {
      await repo.deleteOne(template.id);
      const templateWithCreatedAt = {
        ...template,
        createdAt: new Date().toISOString(),
      } as AppRemoteResourceTemplate;
      await repo.createOne(templateWithCreatedAt);
    }
  }
}
