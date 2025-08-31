import '@carbon/web-components/es/components/data-table/table-header-row.js';

import { Directive } from '@angular/core';
import type CDSTableHeaderRow from '@carbon/web-components/es/components/data-table/table-header-row.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-header-row',
})
export class CDSTableHeaderRowDirective extends CDSBaseDirective<CDSTableHeaderRow> {}
