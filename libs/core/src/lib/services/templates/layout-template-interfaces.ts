import { z } from 'zod';

import type { ConfigWithStatus } from './shared-types';

export const ZGridConfigs = z.strictObject({
  columns: z.number(),
  rowHeight: z.string(),
  gap: z.string(),
  padding: z.string(),
});
export type GridConfigs = z.infer<typeof ZGridConfigs>;

export const ZUIElementPositionAndSize = z.strictObject({
  cols: z.number().optional(),
  rows: z.number().optional(),
  maxHeight: z.string().optional(),
});
export type UIElementPositionAndSize = z.infer<typeof ZUIElementPositionAndSize>;

export const ZUIElementInstance = z.strictObject({
  id: z.string(),
  uiElementTemplateId: z.string(),
  positionAndSize: ZUIElementPositionAndSize.optional(),
});
export type UIElementInstance = z.infer<typeof ZUIElementInstance>;

export const ZLayoutTemplate = z
  .strictObject({
    id: z.string(),
    gridConfigs: ZGridConfigs.partial().optional(),
    uiElementInstances: z.array(ZUIElementInstance),
  })
  .describe('LayoutTemplateSchema');
export type LayoutTemplate = z.infer<typeof ZLayoutTemplate>;

export type LayoutTemplateWithStatus = ConfigWithStatus<LayoutTemplate>;
