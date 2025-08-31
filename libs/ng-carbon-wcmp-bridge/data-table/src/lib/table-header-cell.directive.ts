import '@carbon/web-components/es/components/data-table/table-header-cell.js';

import { Directive } from '@angular/core';
import type CDSTableHeaderCell from '@carbon/web-components/es/components/data-table/table-header-cell.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-header-cell',
})
export class CDSTableHeaderCellDirective extends CDSBaseDirective<CDSTableHeaderCell> {}
