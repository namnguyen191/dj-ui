import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppUIElementTemplate, TimeStamp } from '../shared/dj-ui-app-template';

const BASE_UI_ELEMENT_TEMPLATE_URL = 'http://localhost:8080/ui-element-templates';

export type CreateAppUIElementTemplatePayload = Omit<AppUIElementTemplate, keyof TimeStamp>;

export type UpdateAppUIElementTemplatePayload = CreateAppUIElementTemplatePayload;

@Injectable({
  providedIn: 'root',
})
export class UIElementTemplatesAPIService {
  readonly #httpClient = inject(HttpClient);

  getAllUIElementTemplates = (): Observable<AppUIElementTemplate[]> => {
    return this.#httpClient.get<AppUIElementTemplate[]>(`${BASE_UI_ELEMENT_TEMPLATE_URL}`);
  };

  createUIElementTemplate = (
    payload: CreateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    return this.#httpClient.post<AppUIElementTemplate>(BASE_UI_ELEMENT_TEMPLATE_URL, payload);
  };

  updateUIElementTemplate = (
    payload: UpdateAppUIElementTemplatePayload
  ): Observable<AppUIElementTemplate> => {
    return this.#httpClient.put<AppUIElementTemplate>(BASE_UI_ELEMENT_TEMPLATE_URL, payload);
  };

  fetchUIElementTemplate(id: string): Observable<AppUIElementTemplate> {
    return this.#httpClient.get<AppUIElementTemplate>(`${BASE_UI_ELEMENT_TEMPLATE_URL}/${id}`);
  }
}
