import { NgModule } from '@angular/core';

import { CDSTableDirective } from './table.directive';
import { CDSTableBodyDirective } from './table-body.directive';
import { CDSTableCellDirective } from './table-cell.directive';
import { CDSTableHeadDirective } from './table-head.directive';
import { CDSTableHeaderCellDirective } from './table-header-cell.directive';
import { CDSTableHeaderRowDirective } from './table-header-row.directive';
import { CDSTableRowDirective } from './table-row.directive';

@NgModule({
  imports: [
    CDSTableBodyDirective,
    CDSTableCellDirective,
    CDSTableHeaderCellDirective,
    CDSTableHeaderRowDirective,
    CDSTableRowDirective,
    CDSTableDirective,
    CDSTableHeadDirective,
  ],
  exports: [
    CDSTableBodyDirective,
    CDSTableCellDirective,
    CDSTableHeaderCellDirective,
    CDSTableHeaderRowDirective,
    CDSTableRowDirective,
    CDSTableDirective,
    CDSTableHeadDirective,
  ],
})
export class CDSTableModule {}
