import { Injectable } from '@angular/core';
import { z } from 'zod';

import { ZodActionHook } from '../events-and-actions/action-hook.service';
import { ZodInterpolationString } from '../interpolation.service';
import { ZStateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, MissingTemplateEvent } from './base-template.service';
import { ConfigWithStatus } from './shared-types';

export const ZRequest = z.strictObject({
  fetcherId: z.string(),
  configs: z.unknown(),
  interpolation: ZodInterpolationString.optional(),
});
export type Request = z.infer<typeof ZRequest>;

export const ZRemoteResourceTemplate = z
  .strictObject({
    id: z.string(),
    stateSubscription: ZStateSubscriptionConfig,
    options: z.strictObject({
      runCondition: z.boolean().optional(),
      requests: z.array(ZRequest),
      onSuccess: z.array(ZodActionHook).optional(),
      parallel: z.boolean().optional(),
    }),
  })
  .describe('RemoteResourceTemplateSchema');
export type RemoteResourceTemplate = z.infer<typeof ZRemoteResourceTemplate>;

export type RemoteResourceTemplateWithStatus = ConfigWithStatus<RemoteResourceTemplate>;

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceTemplateService extends BaseTemplateService<RemoteResourceTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent =
    'MISSING_REMOTE_RESOURCE_TEMPLATE';
}
