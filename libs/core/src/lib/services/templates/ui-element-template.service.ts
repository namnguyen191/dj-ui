import { Injectable } from '@angular/core';
import { z } from 'zod';

import { ZUIElementBaseConfigs } from '../../components/base-ui-element.component';
import { type ActionHook, ZodActionHook } from '../events-and-actions/action-hook.service';
import { ZStateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, type MissingTemplateEvent } from './base-template.service';
import type { ConfigWithStatus } from './shared-types';

export const createUIElementTemplateOptionsSchema = <T extends z.ZodRawShape>(
  customOptionsSchema: z.ZodObject<T>
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => ZUIElementBaseConfigs.extend(customOptionsSchema.shape);
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

  return zObj as unknown as z.ZodType<{
    [K in T]?: ActionHook[];
  }>;
};

export const ZBaseTemplateSchema = z.strictObject({
  id: z.string(),
  type: z.string(),
  remoteResourceIds: z.array(z.string()).optional(),
  stateSubscription: ZStateSubscriptionConfig.optional(),
});
export const createUIElementTemplateSchema = <
  TConfigs extends z.ZodRawShape,
  TEvent extends string,
>(
  configs: z.ZodObject<TConfigs>,
  events: TEvent[] = []
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  return ZBaseTemplateSchema.extend({
    options: createUIElementTemplateOptionsSchema(configs),
    eventsHooks: createEventsToHooksMapSchema(events).optional(),
  }).strict();
};
export const ZBaseUIElementTemplate = createUIElementTemplateSchema(z.object({}), []);
export type UIElementTemplate = z.infer<typeof ZBaseUIElementTemplate>;
export type AnyUIElementTemplate = Omit<UIElementTemplate, 'options'> & {
  options: {
    [key: string]: unknown;
  };
};

export type UIElementTemplateWithStatus = ConfigWithStatus<UIElementTemplate>;

@Injectable({
  providedIn: 'root',
})
export class UIElementTemplateService extends BaseTemplateService<UIElementTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent = 'MISSING_UI_ELEMENT_TEMPLATE';
}
