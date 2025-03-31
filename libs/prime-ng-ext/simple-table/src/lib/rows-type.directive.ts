import { Directive } from '@angular/core';

import { TableColumnsConfig, TableRowObject } from './simple-table.interface';

@Directive({ selector: 'ng-template[rows]' })
export class RowsTemplateTypeDirective {
  public static ngTemplateContextGuard(
    _dir: RowsTemplateTypeDirective,
    ctx: unknown
  ): ctx is { $implicit: TableRowObject; columns: TableColumnsConfig } {
    return true;
  }
}
