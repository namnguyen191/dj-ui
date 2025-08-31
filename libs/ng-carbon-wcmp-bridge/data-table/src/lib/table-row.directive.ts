import '@carbon/web-components/es/components/data-table/table-row.js';

import { Directive } from '@angular/core';
import type CDSTableRow from '@carbon/web-components/es/components/data-table/table-row.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-row',
})
export class CDSTableRowDirective extends CDSBaseDirective<CDSTableRow> {}
