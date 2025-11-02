import '@carbon/web-components/es/components/data-table/table.js';

import { Directive, input } from '@angular/core';
import type CDSTable from '@carbon/web-components/es/components/data-table/table.js';
import {
  CDSBaseDirective,
  type CDSDirectiveImpl,
  type TableSize,
} from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table',
})
export class CDSTableDirective
  extends CDSBaseDirective<CDSTable>
  implements CDSDirectiveImpl<CDSTable>
{
  radio = input<boolean>();
  collator = input<unknown>();
  expandable = input<boolean>();
  headerCount = input<number>();
  isSelectable = input<boolean>();
  isSortable = input<boolean>();
  locale = input<string>();
  overflowMenuOnHover = input<boolean>();
  size = input<TableSize>();
  useStaticWidth = input<boolean>();
  useZebraStyles = input<boolean>();
  withHeader = input<boolean>();
  withRowAILabels = input<boolean>();
  withRowSlugs = input<boolean>();
  batchExpansion = input<boolean>();
}
