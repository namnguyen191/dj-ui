import '@angular/compiler';

import {
  type ActionHook,
  createUIElementTemplateSchema,
  type RemoteResourceRequest,
  type RemoteResourceTemplate,
  ZBaseUIETemplate,
  ZStateSubscriptionConfig,
} from '@dj-ui/core';
import { z } from 'zod';

export const generateAppUIESchemas = <
  const TUIESchem extends typeof ZBaseUIETemplate,
  const TAHSchem extends z.ZodType<ActionHook>,
>(params: {
  uieSchemas: TUIESchem[];
  actionHookSchemas: TAHSchem[];
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => {
  const { uieSchemas, actionHookSchemas } = params;
  const appSchemas: (typeof ZBaseUIETemplate)[] = [];
  for (const zt of uieSchemas) {
    let events: string[] | undefined = undefined;
    if (
      'eventsHooks' in zt.shape &&
      !((zt.shape.eventsHooks as z.ZodOptional<z.ZodAny>).def.innerType instanceof z.ZodNull)
    ) {
      events = Object.keys(
        (zt.shape.eventsHooks as z.ZodOptional<z.ZodObject>).def.innerType.shape
      );
    }

    const newSchema = createUIElementTemplateSchema(
      zt.shape.options,
      events,
      actionHookSchemas
    ).describe(zt.description ?? 'Missing description for: ' + JSON.stringify(zt));
    appSchemas.push(newSchema);
  }

  return appSchemas;
};

export const generateAppRRTSchemas = <
  const TZRequest extends z.ZodType<RemoteResourceRequest>,
  const TZActionHook extends z.ZodType<ActionHook>,
>(params: {
  zRequests: TZRequest[];
  zActionHooks: TZActionHook[];
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => {
  const { zRequests, zActionHooks } = params;

  return z.strictObject({
    id: z.string(),
    stateSubscription: ZStateSubscriptionConfig.optional(),
    options: z.strictObject({
      runCondition: z.boolean().optional(),
      requests: z.array(z.union(zRequests)),
      onSuccess: z.array(z.union(zActionHooks)).optional(),
      parallel: z.boolean().optional(),
    }),
  }) satisfies z.ZodType<RemoteResourceTemplate>;
};
