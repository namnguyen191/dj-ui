import '@carbon/web-components/es/components/data-table/table-cell.js';

import { Directive } from '@angular/core';
import type CDSTableCell from '@carbon/web-components/es/components/data-table/table-cell.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-cell',
})
export class CDSTableCellDirective extends CDSBaseDirective<CDSTableCell> {}
