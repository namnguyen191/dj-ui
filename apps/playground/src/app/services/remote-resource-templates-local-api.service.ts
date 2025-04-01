import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RemoteResourceTemplateService } from '@dj-ui/core';
import { firstValueFrom, from, map, Observable, switchMap, tap } from 'rxjs';

import type { AppRemoteResourceTemplate } from '../shared/dj-ui-app-template';
import { mockRemoteResourceTemplates } from '../utils/mock-templates';
import { IdbService } from './idb.service';
import {
  type CreateAppRemoteResourceTemplatePayload,
  RemoteResourceTemplatesAPIService,
  type UpdateAppRemoteResourceTemplatePayload,
} from './remote-resource-templates-api.service';

@Injectable()
export class RemoteResourceTemplatesLocalAPIService extends RemoteResourceTemplatesAPIService {
  readonly #remoteResourceTemplateService = inject(RemoteResourceTemplateService);

  readonly #idbService = inject(IdbService);
  readonly #remoteResourceTemplateRepo$ = from(this.#idbService.getRepo('remoteResourceTemplates'));

  override getAllRemoteResourceTemplates = (): Observable<AppRemoteResourceTemplate[]> => {
    return this.#remoteResourceTemplateRepo$.pipe(switchMap((repo) => repo.getAll()));
  };

  override createRemoteResourceTemplate = (
    payload: CreateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    const createdTemplate: AppRemoteResourceTemplate = {
      ...payload,
      createdAt: new Date().toUTCString(),
    };

    return this.#remoteResourceTemplateRepo$.pipe(
      switchMap((repo) => repo.createOne(createdTemplate))
    );
  };

  override updateRemoteResourceTemplate = (
    payload: UpdateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    return this.fetchRemoteResourceTemplate(payload.id).pipe(
      switchMap((existingTemplate) => {
        const updatedTemplate: AppRemoteResourceTemplate = {
          ...payload,
          createdAt: existingTemplate.createdAt,
          updatedAt: new Date().toUTCString(),
        };

        return this.#remoteResourceTemplateRepo$.pipe(
          switchMap((repo) => repo.updateOne(updatedTemplate)),
          tap({
            next: () => {
              this.#remoteResourceTemplateService.updateTemplate(updatedTemplate);
            },
          })
        );
      })
    );
  };

  override fetchRemoteResourceTemplate(id: string): Observable<AppRemoteResourceTemplate> {
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

  async resetTemplates(): Promise<void> {
    const repo = await firstValueFrom(this.#remoteResourceTemplateRepo$);
    await repo.clearAll();
    for (const template of mockRemoteResourceTemplates) {
      const templateWithCreatedAt = {
        ...template,
        createdAt: new Date().toUTCString(),
      } as AppRemoteResourceTemplate;
      await repo.createOne(templateWithCreatedAt);
    }
  }
}
