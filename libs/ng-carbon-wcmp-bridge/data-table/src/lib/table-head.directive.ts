import '@carbon/web-components/es/components/data-table/table-head.js';

import { Directive } from '@angular/core';
import type CDSTableHead from '@carbon/web-components/es/components/data-table/table-head.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-head',
})
export class CDSTableHeadDirective extends CDSBaseDirective<CDSTableHead> {}
