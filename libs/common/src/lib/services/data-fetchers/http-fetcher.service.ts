import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { createZRemoteResourceRequest, type DataFetcher } from '@dj-ui/core';
import type { JsonValue } from 'type-fest';
import { z } from 'zod';

export type HttpFetcherConfigs = {
  endpoint: string;
  method: string;
  body?: JsonValue;
  headers?: Record<string, string>;
};

export const ZHttpFetcherConfigs = z.strictObject({
  endpoint: z.string(),
  method: z.string(),
  body: z.any().optional(),
  headers: z.record(z.string(), z.string()).optional(),
}) satisfies z.ZodType<HttpFetcherConfigs>;

export const ZHttpFetcher = createZRemoteResourceRequest('httpFetcher', ZHttpFetcherConfigs);

@Injectable({
  providedIn: 'root',
})
export class HttpFetcherService {
  readonly #httpClient = inject(HttpClient);

  #httpFetcher: DataFetcher<HttpFetcherConfigs> = (configs: HttpFetcherConfigs) => {
    const { endpoint, method, headers, body } = configs;

    return this.#httpClient.request(method, endpoint, {
      headers,
      body,
    });
  };

  httpFetcher = this.#httpFetcher.bind(this);
}
