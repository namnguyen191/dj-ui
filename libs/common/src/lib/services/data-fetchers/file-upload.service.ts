import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { DataFetcher } from '@dj-ui/core';

export type SingleFileUploadFetcherConfigs = {
  endpoint: string;
  file: File;
  responseType?: 'text' | 'json';
};

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  readonly #httpClient = inject(HttpClient);

  singleFileUploadFetcher: DataFetcher<SingleFileUploadFetcherConfigs> = (
    configs: SingleFileUploadFetcherConfigs
  ) => {
    const { endpoint, file, responseType = 'json' } = configs;

    const formData = new FormData();
    formData.append('file', file);

    return this.#httpClient.post(endpoint, formData, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      responseType: responseType as any,
    });
  };
}
