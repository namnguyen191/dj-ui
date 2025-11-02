import '@carbon/web-components/es/components/data-table/table-header-row.js';

import { Directive, input } from '@angular/core';
import type CDSTableHeaderRow from '@carbon/web-components/es/components/data-table/table-header-row.js';
import { CDSBaseDirective, type CDSDirectiveImpl } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-header-row',
})
export class CDSTableHeaderRowDirective
  extends CDSBaseDirective<CDSTableHeaderRow>
  implements CDSDirectiveImpl<CDSTableHeaderRow>
{
  batchExpansion = input<boolean>();
  disabled = input<boolean>();
  even = input<boolean>();
  expandable = input<boolean>();
  expanded = input<boolean>();
  filtered = input<boolean>();
  hideCheckbox = input<boolean>();
  highlighted = input<boolean>();
  odd = input<boolean>();
  overflowMenuOnHover = input<boolean>();
  radio = input<boolean>();
  selected = input<boolean>();
  selectionLabel = input<string>();
  selectionName = input<string>();
  selectionValue = input<string>();
}
