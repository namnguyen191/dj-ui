import '@carbon/web-components/es/components/modal/modal-body-content.js';

import { Directive } from '@angular/core';
import type CDSModalBodyContent from '@carbon/web-components/es/components/modal/modal-body-content.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-modal-body-content',
})
export class CDSModalBodyContentDirective extends CDSBaseDirective<CDSModalBodyContent> {}
