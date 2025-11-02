import type { TABLE_SIZE } from '@carbon/web-components/es/components/data-table/table.js';
import type {
  TABLE_SORT_CYCLE,
  TABLE_SORT_DIRECTION,
} from '@carbon/web-components/es/components/data-table/table-header-cell.js';
import type { MODAL_SIZE } from '@carbon/web-components/es/components/modal/defs.js';

export type ModalSize = `${MODAL_SIZE}`;
export type ModalBeingClosedEvent = CustomEvent<{ triggeredBy: HTMLElement }>;

export type TableSize = `${TABLE_SIZE}`;
export type TableSortCycle = `${TABLE_SORT_CYCLE}`;
export type TableSortDirection = `${TABLE_SORT_DIRECTION}`;
