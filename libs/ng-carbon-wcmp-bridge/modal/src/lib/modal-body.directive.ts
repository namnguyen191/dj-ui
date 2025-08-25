import '@carbon/web-components/es/components/modal/modal-body.js';

import { Directive } from '@angular/core';
import type CDSModalBody from '@carbon/web-components/es/components/modal/modal-body.js';
import { CDSBaseDirective } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-modal-body',
})
export class CDSModalBodyDirective extends CDSBaseDirective<CDSModalBody> {}
