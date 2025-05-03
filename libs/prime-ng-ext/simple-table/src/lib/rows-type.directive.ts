import { Directive } from '@angular/core';
import type { TableColumnsConfig, TableRowObject } from '@dj-ui/prime-ng-ext/shared';

@Directive({ selector: 'ng-template[rows]' })
export class RowsTemplateTypeDirective {
  public static ngTemplateContextGuard(
    _dir: RowsTemplateTypeDirective,
    ctx: unknown
  ): ctx is { $implicit: TableRowObject; columns: TableColumnsConfig } {
    return true;
  }
}
