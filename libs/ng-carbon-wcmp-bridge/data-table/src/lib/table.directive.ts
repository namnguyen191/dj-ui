import '@carbon/web-components/es/components/data-table/table.js';

import { Directive, input } from '@angular/core';
import type CDSTable from '@carbon/web-components/es/components/data-table/table.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-table',
})
export class CDSTableDirective extends CDSBaseDirective<CDSTable> {
  batchExpansion = input<boolean>();
}
