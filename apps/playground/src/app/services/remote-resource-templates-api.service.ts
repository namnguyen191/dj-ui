import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppRemoteResourceTemplate, TimeStamp } from '../shared/dj-ui-app-template';

const BASE_LAYOUT_TEMPLATE_URL = 'http://localhost:8080/remote-resource-templates';

export type CreateAppRemoteResourceTemplatePayload = Omit<
  AppRemoteResourceTemplate,
  keyof TimeStamp
>;

export type UpdateAppRemoteResourceTemplatePayload = CreateAppRemoteResourceTemplatePayload;

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceTemplatesAPIService {
  readonly #httpClient = inject(HttpClient);

  getAllRemoteResourceTemplates = (): Observable<AppRemoteResourceTemplate[]> => {
    return this.#httpClient.get<AppRemoteResourceTemplate[]>(`${BASE_LAYOUT_TEMPLATE_URL}`);
  };

  createRemoteResourceTemplate = (
    payload: CreateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    return this.#httpClient.post<AppRemoteResourceTemplate>(BASE_LAYOUT_TEMPLATE_URL, payload);
  };

  updateRemoteResourceTemplate = (
    payload: UpdateAppRemoteResourceTemplatePayload
  ): Observable<AppRemoteResourceTemplate> => {
    return this.#httpClient.put<AppRemoteResourceTemplate>(BASE_LAYOUT_TEMPLATE_URL, payload);
  };

  fetchRemoteResourceTemplate(id: string): Observable<AppRemoteResourceTemplate> {
    return this.#httpClient.get<AppRemoteResourceTemplate>(`${BASE_LAYOUT_TEMPLATE_URL}/${id}`);
  }
}
