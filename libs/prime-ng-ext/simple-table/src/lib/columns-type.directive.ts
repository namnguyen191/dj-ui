import { Directive } from '@angular/core';

import type { TableColumnsConfig } from './simple-table.interface';

@Directive({ selector: 'ng-template[columns]' })
export class ColumnsTemplateTypeDirective {
  public static ngTemplateContextGuard(
    _dir: ColumnsTemplateTypeDirective,
    ctx: unknown
  ): ctx is { $implicit: TableColumnsConfig } {
    return true;
  }
}
