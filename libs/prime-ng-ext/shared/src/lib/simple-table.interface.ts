import { createUIElementTemplateSchema } from '@dj-ui/core';
import type { UnionToTuple } from 'type-fest';
import { z } from 'zod';

export const SimpleTableElementType = 'SIMPLE_TABLE';
export const SimpleTableSymbol = Symbol('SimpleTable');

export const ZTableRowObject = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.bigint(),
    z.symbol(),
    z.record(z.string(), z.unknown()),
  ])
);
export type TableRowObject = z.infer<typeof ZTableRowObject>;
export const ZTableRowsConfig = z.array(ZTableRowObject);
export type TableRowsConfig = z.infer<typeof ZTableRowsConfig>;

export const ZTableColumnObject = z.strictObject({
  id: z.string(),
  label: z.string(),
  disableResizable: z.boolean().optional(),
  templateId: z.string().optional(),
});
export type TableColumnObject = z.infer<typeof ZTableColumnObject>;
export const ZTableColumnsConfig = z.array(ZTableColumnObject);
export type TableColumnsConfig = z.infer<typeof ZTableColumnsConfig>;

export const ZTablePaginationConfigs = z.strictObject({
  pageSizes: z.array(z.number()).optional(),
  totalDataLength: z.number().optional(),
  currentPage: z.number().optional(),
  currentPageLength: z.number().optional(),
});
export type TablePaginationConfigs = z.infer<typeof ZTablePaginationConfigs>;

export const ZTableStylesConfigs = z.strictObject({
  fixedDataRowsHeight: z.string().optional(),
});
export type TableStylesConfigs = z.infer<typeof ZTableStylesConfigs>;

export const ZSimpleTableUIEConfigs = z.object({
  title: z.string(),
  resizableColumns: z.boolean(),
  stripes: z.boolean(),
  gridLines: z.boolean(),
  columns: ZTableColumnsConfig,
  rows: ZTableRowsConfig,
  pagination: ZTablePaginationConfigs,
  styles: ZTableStylesConfigs,
});

export type SimpleTableUIEConfigs = z.infer<typeof ZSimpleTableUIEConfigs>;

export type PaginationChangedPayload = { pageLength: number; selectedPage: number };

export type SimpleTableUIEEvents = {
  paginationChanged: PaginationChangedPayload;
};

const allEvents: UnionToTuple<keyof SimpleTableUIEEvents> = ['paginationChanged'];
export const ZSimpleTableUIESchema = createUIElementTemplateSchema(
  ZSimpleTableUIEConfigs,
  allEvents
).describe('PrimeNgSimpleTableUIESchema');
