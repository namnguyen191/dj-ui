import '@carbon/web-components/es/components/data-table/table-body.js';

import { Directive } from '@angular/core';
import type CDSTableBody from '@carbon/web-components/es/components/data-table/table-body.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table-body',
})
export class CDSTableBodyDirective extends CDSBaseDirective<CDSTableBody> {}
