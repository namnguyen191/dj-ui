import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SimpleTextConfigs } from '@dj-ui/carbon-ext/carbon-simple-text';
import { catchError, Observable, of } from 'rxjs';

import { AppUIElementTemplate, TimeStamp } from '../shared/dj-ui-app-template';

const BASE_UI_ELEMENT_TEMPLATE_URL = 'http://localhost:8080/ui-element-templates';

export type CreateAppUIElementTemplatePayload = Omit<AppUIElementTemplate, keyof TimeStamp>;

export type UpdateAppUIElementTemplatePayload = CreateAppUIElementTemplatePayload;

const getErrorTemplate = (id: string): AppUIElementTemplate<SimpleTextConfigs> => ({
  id,
  name: 'UI Element error template',
  createdAt: new Date().toUTCString(),
  description:
    'Use this template to display an error for when we failed to fetch the actual template',
  type: 'CARBON_SIMPLE_TEXT',
  options: {
    textBlocks: [
      {
        text: 'Something went wrong',
        type: 'title',
      },
      {
        text: 'We could not fetch this UI right now. Please refresh your browser or try again later',
      },
    ],
  },
});

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
    return this.#httpClient.get<AppUIElementTemplate>(`${BASE_UI_ELEMENT_TEMPLATE_URL}/${id}`).pipe(
      catchError(() => {
        return of(getErrorTemplate(id));
      })
    );
  }
}
