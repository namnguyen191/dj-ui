import '@carbon/web-components/es/components/data-table/table-header-cell.js';

import { Directive, input } from '@angular/core';
import type CDSTableHeaderCell from '@carbon/web-components/es/components/data-table/table-header-cell.js';
import {
  CDSBaseDirective,
  type CDSDirectiveImpl,
  type TableSortCycle,
  type TableSortDirection,
} from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-header-cell',
})
export class CDSTableHeaderCellDirective
  extends CDSBaseDirective<CDSTableHeaderCell>
  implements CDSDirectiveImpl<CDSTableHeaderCell>
{
  isExpandable = input<boolean>();
  isSelectable = input<boolean>();
  isSortable = input<boolean>();
  sortActive = input<boolean>();
  sortCycle = input<TableSortCycle>();
  sortDirection = input<TableSortDirection>();
}
