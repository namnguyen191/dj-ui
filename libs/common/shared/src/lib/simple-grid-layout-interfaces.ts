import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const SimpleGridLayoutElementType = 'SIMPLE_GRID_LAYOUT';
export const SimpleGridLayoutSymbol = Symbol('SimpleGridLayout');

export const ZGridConfigOption = z.strictObject({
  columns: z.number().optional(),
  rowHeight: z.string().optional(),
  gap: z.string().optional(),
  padding: z.string().optional(),
});
export type GridConfigOption = z.infer<typeof ZGridConfigOption>;

export const ZSimpleGridUIElementPositionAndSize = z.strictObject({
  cols: z.number().optional(),
  rows: z.number().optional(),
  maxHeight: z.string().optional(),
});
export type SimpleGridUIElementPositionAndSize = z.infer<
  typeof ZSimpleGridUIElementPositionAndSize
>;

export const ZUIElementInstanceConfigOption = z.strictObject({
  id: z.string(),
  uiElementTemplateId: z.string(),
  positionAndSize: ZSimpleGridUIElementPositionAndSize.optional(),
});
export type UIElementInstanceConfigOption = z.infer<typeof ZUIElementInstanceConfigOption>;

export const ZSimpleGridLayoutUIEConfigs = z.strictObject({
  grid: ZGridConfigOption,
  uiElementInstances: z.array(ZUIElementInstanceConfigOption),
});

export type SimpleGridLayoutUIEConfigs = z.infer<typeof ZSimpleGridLayoutUIEConfigs>;

export const ZSimpleGridLayoutUIESchema = createUIElementTemplateSchema(
  ZSimpleGridLayoutUIEConfigs
).describe('CommonSimpleGridUIESchema');
