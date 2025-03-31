import { Injectable } from '@angular/core';
import { z } from 'zod';

import { ZUIElementRequiredConfigs } from '../../components/base-ui-element.component';
import { ActionHook, ZodActionHook } from '../events-and-actions/action-hook.service';
import { ZStateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, MissingTemplateEvent } from './base-template.service';
import { ConfigWithStatus } from './shared-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUIElementTemplateOptionsSchema = <T extends z.ZodObject<any>>(
  customOptionsSchema: T
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => ZUIElementRequiredConfigs.merge(customOptionsSchema).partial();
export const ZUIElementTemplateOptions = createUIElementTemplateOptionsSchema(z.object({}));
export type UIElementTemplateOptions = z.infer<typeof ZUIElementTemplateOptions>;

export const ZUnknownEvent = z.literal('unknown-event');
export type UnknownEvent = z.infer<typeof ZUnknownEvent>;
export const ZNoEvent = z.literal('no-event');
export type NoEvent = z.infer<typeof ZNoEvent>;

export const createEventsToHooksMapSchema = <T extends string>(
  events: T[]
): z.ZodType<{
  [K in T]?: ActionHook[];
}> => {
  let zObj = z.object({});
  for (const evt of events) {
    zObj = zObj.extend({
      [evt]: z.array(ZodActionHook).optional(),
    });
  }

  return zObj;
};
export const createUIElementTemplateSchema = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TConfigs extends z.ZodObject<any>,
  TEvent extends string,
>(
  configs: TConfigs,
  events: TEvent[] = []
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  return z.strictObject({
    id: z.string(),
    type: z.string(),
    remoteResourceIds: z.array(z.string()).optional(),
    stateSubscription: ZStateSubscriptionConfig.optional(),
    options: createUIElementTemplateOptionsSchema(configs),
    eventsHooks: createEventsToHooksMapSchema(events).optional(),
  });
};
export const ZBaseUIElementTemplate = createUIElementTemplateSchema(z.object({}), []);
export type UIElementTemplate = z.infer<typeof ZBaseUIElementTemplate>;

export type UIElementTemplateWithStatus = ConfigWithStatus<UIElementTemplate>;

@Injectable({
  providedIn: 'root',
})
export class UIElementTemplateService extends BaseTemplateService<UIElementTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent = 'MISSING_UI_ELEMENT_TEMPLATE';
}
