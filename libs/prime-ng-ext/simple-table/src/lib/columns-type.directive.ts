import { Directive } from '@angular/core';
import type { TableColumnsConfig } from '@dj-ui/prime-ng-ext/shared';

@Directive({ selector: 'ng-template[columns]' })
export class ColumnsTemplateTypeDirective {
  public static ngTemplateContextGuard(
    _dir: ColumnsTemplateTypeDirective,
    ctx: unknown
  ): ctx is { $implicit: TableColumnsConfig } {
    return true;
  }
}
