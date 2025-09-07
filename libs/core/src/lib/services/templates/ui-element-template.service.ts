import { Injectable } from '@angular/core';
import type { UnknownRecord } from 'type-fest';
import { z } from 'zod';

import { ZUIElementBaseConfigs } from '../../components/base-ui-element.component';
import { type ActionHook, ZGenericActionHook } from '../events-and-actions/action-hook.service';
import { type StateSubscriptionConfig, ZStateSubscriptionConfig } from '../state-store.service';
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

export const createEventsToHooksMapSchema = <
  TEvent extends string,
  const TZActionHook extends z.ZodType<ActionHook>,
>(
  events: TEvent[],
  zActionHooks: TZActionHook[]
): z.ZodType<{
  [K in TEvent]?: z.infer<TZActionHook>[];
}> => {
  let zObj = z.object({});
  for (const evt of events) {
    if (zActionHooks.length) {
      zObj = zObj.extend({
        [evt]: z.array(z.union(zActionHooks)).optional(),
      });
    } else {
      zObj = zObj.extend({
        [evt]: z.array(ZGenericActionHook).optional(),
      });
    }
  }

  return zObj as unknown as z.ZodType<{
    [K in TEvent]?: z.infer<TZActionHook>[];
  }>;
};

export type UIETemplate<
  TType extends string = string,
  TOptions extends UnknownRecord = Record<string, unknown>,
  TEvent extends string = string,
  TActionHook extends ActionHook = ActionHook,
> = {
  id: string;
  type: TType;
  options: TOptions;
  remoteResourceIds?: string[];
  stateSubscription?: StateSubscriptionConfig;
  eventsHooks?: {
    [K in TEvent]: TActionHook[];
  };
};
export const ZBaseUIETemplate = z.strictObject({
  id: z.string(),
  type: z.string(),
  remoteResourceIds: z.array(z.string()).optional(),
  stateSubscription: ZStateSubscriptionConfig.optional(),
  options: z.object(),
}) satisfies z.ZodType<UIETemplate>;

export const createUIElementTemplateSchema = <
  TConfigs extends z.ZodRawShape,
  TEvent extends string,
  const TActionHook extends ActionHook,
  const TZActionHook extends z.ZodType<TActionHook>,
>(
  zConfigs: z.ZodObject<TConfigs>,
  events: TEvent[] = [],
  zActionHooks?: TZActionHook[]
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  return ZBaseUIETemplate.extend({
    options: createUIElementTemplateOptionsSchema(zConfigs),
    eventsHooks: events.length
      ? createEventsToHooksMapSchema(events, zActionHooks ?? []).optional()
      : z.null().optional(),
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
