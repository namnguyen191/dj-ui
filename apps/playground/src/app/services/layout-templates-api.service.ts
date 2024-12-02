import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppLayoutTemplate, TimeStamp } from '../shared/dj-ui-app-template';

const BASE_LAYOUT_TEMPLATE_URL = 'http://localhost:8080/layout-templates';

export type CreateAppLayoutTemplatePayload = Omit<AppLayoutTemplate, keyof TimeStamp>;

export type UpdateAppLayoutTemplatePayload = CreateAppLayoutTemplatePayload;

@Injectable({
  providedIn: 'root',
})
export class LayoutTemplatesAPIService {
  readonly #httpClient = inject(HttpClient);

  getAllLayoutTemplates = (): Observable<AppLayoutTemplate[]> => {
    return this.#httpClient.get<AppLayoutTemplate[]>(`${BASE_LAYOUT_TEMPLATE_URL}`);
  };

  createLayoutTemplate = (
    payload: CreateAppLayoutTemplatePayload
  ): Observable<AppLayoutTemplate> => {
    return this.#httpClient.post<AppLayoutTemplate>(BASE_LAYOUT_TEMPLATE_URL, payload);
  };

  updateLayoutTemplate = (
    payload: UpdateAppLayoutTemplatePayload
  ): Observable<AppLayoutTemplate> => {
    return this.#httpClient.put<AppLayoutTemplate>(BASE_LAYOUT_TEMPLATE_URL, payload);
  };

  fetchLayoutTemplate(id: string): Observable<AppLayoutTemplate> {
    return this.#httpClient.get<AppLayoutTemplate>(`${BASE_LAYOUT_TEMPLATE_URL}/${id}`);
  }
}
