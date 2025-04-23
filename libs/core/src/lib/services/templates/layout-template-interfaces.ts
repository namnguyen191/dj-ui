import { z } from 'zod';

import type { ConfigWithStatus } from './shared-types';

export const ZUIElementInstance = z.strictObject({
  id: z.string(),
  uiElementTemplateId: z.string(),
});
export type UIElementInstance = z.infer<typeof ZUIElementInstance>;

export const ZLayoutTemplate = z
  .strictObject({
    id: z.string(),
    uiElementInstances: z.array(ZUIElementInstance),
  })
  .describe('LayoutTemplateSchema');
export type LayoutTemplate = z.infer<typeof ZLayoutTemplate>;

export type LayoutTemplateWithStatus = ConfigWithStatus<LayoutTemplate>;
