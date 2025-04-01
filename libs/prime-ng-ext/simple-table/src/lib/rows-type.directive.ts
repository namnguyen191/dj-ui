import { Directive } from '@angular/core';

import type { TableColumnsConfig, TableRowObject } from './simple-table.interface';

@Directive({ selector: 'ng-template[rows]' })
export class RowsTemplateTypeDirective {
  public static ngTemplateContextGuard(
    _dir: RowsTemplateTypeDirective,
    ctx: unknown
  ): ctx is { $implicit: TableRowObject; columns: TableColumnsConfig } {
    return true;
  }
}
