import { ZLayoutTemplate, ZUIElementInstance } from '@dj-ui/core';
import { z } from 'zod';

export const ZGridConfigs = z.strictObject({
  columns: z.number().optional(),
  rowHeight: z.string().optional(),
  gap: z.string().optional(),
  padding: z.string().optional(),
});
export type GridConfigs = z.infer<typeof ZGridConfigs>;

export const ZSimpleGridUIElementPositionAndSize = z.strictObject({
  cols: z.number().optional(),
  rows: z.number().optional(),
  maxHeight: z.string().optional(),
});
export type SimpleGridUIElementPositionAndSize = z.infer<
  typeof ZSimpleGridUIElementPositionAndSize
>;

export const ZSimpleGridUIElementInstance = ZUIElementInstance.extend({
  positionAndSize: ZSimpleGridUIElementPositionAndSize.optional(),
});
export type SimpleGridUIElementInstance = z.infer<typeof ZSimpleGridUIElementInstance>;

export const ZSimpleGridLayoutTemplate = ZLayoutTemplate.extend({
  gridConfigs: ZGridConfigs,
  uiElementInstances: z.array(ZSimpleGridUIElementInstance),
}).describe('SIMPLE_GRID_LAYOUT');
export type SimpleGridLayoutTemplate = z.infer<typeof ZSimpleGridLayoutTemplate>;
