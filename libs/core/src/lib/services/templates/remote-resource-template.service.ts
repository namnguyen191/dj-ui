import { Injectable } from '@angular/core';
import type { JsonValue } from 'type-fest';
import { z } from 'zod';

import { type ActionHook, ZGenericActionHook } from '../events-and-actions/action-hook.service';
import { ZodInterpolationString } from '../interpolation.service';
import { type StateSubscriptionConfig, ZStateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, type MissingTemplateEvent } from './base-template.service';
import type { ConfigWithStatus } from './shared-types';

export type RemoteResourceRequest<
  TFetcherId extends string = string,
  TConfigs extends JsonValue = JsonValue,
> = {
  fetcherId: TFetcherId;
  configs: TConfigs;
  interpolation?: string;
};

export const createZRemoteResourceRequest = <
  TFetcherId extends string,
  TFetcherConfigs extends JsonValue,
>(
  fetcherId: TFetcherId,
  zFetcherConfigs: z.ZodType<TFetcherConfigs>
): z.ZodType<RemoteResourceRequest<TFetcherId, TFetcherConfigs>> => {
  return z.object({
    fetcherId: z.literal(fetcherId),
    configs: zFetcherConfigs,
    interpolation: ZodInterpolationString.optional(),
  });
};

export const ZGenericRequest = z.strictObject({
  fetcherId: z.string(),
  configs: z.any(),
  interpolation: ZodInterpolationString.optional(),
}) satisfies z.ZodType<RemoteResourceRequest>;

export type RemoteResourceTemplate<
  TFetcherId extends string = string,
  TConfigs extends JsonValue = JsonValue,
  TActionHookType extends string = string,
  TActionHookPayload extends JsonValue = JsonValue,
> = {
  id: string;
  stateSubscription?: StateSubscriptionConfig;
  options: {
    runCondition?: boolean;
    requests: RemoteResourceRequest<TFetcherId, TConfigs>[];
    onSuccess?: ActionHook<TActionHookType, TActionHookPayload>[];
    parallel?: boolean;
  };
};
export const ZGenericRemoteResourceTemplate = z
  .strictObject({
    id: z.string(),
    stateSubscription: ZStateSubscriptionConfig.optional(),
    options: z.strictObject({
      runCondition: z.boolean().optional(),
      requests: z.array(ZGenericRequest),
      onSuccess: z.array(ZGenericActionHook).optional(),
      parallel: z.boolean().optional(),
    }),
  })
  .describe('RemoteResourceTemplateSchema') satisfies z.ZodType<RemoteResourceTemplate>;

export type RemoteResourceTemplateWithStatus = ConfigWithStatus<RemoteResourceTemplate>;

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceTemplateService extends BaseTemplateService<RemoteResourceTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent =
    'MISSING_REMOTE_RESOURCE_TEMPLATE';
}
