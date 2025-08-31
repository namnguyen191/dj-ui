import '@carbon/web-components/es/components/modal/modal.js';

import { Directive, input, output } from '@angular/core';
import type CDSModal from '@carbon/web-components/es/components/modal/modal.js';
import { CDSBaseDirective, type ModalBeingClosedEvent } from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-modal',
})
export class CDSModalDirective extends CDSBaseDirective<CDSModal> {
  open = input<boolean>();

  'cds-modal-beingclosed' = output<ModalBeingClosedEvent>();
}
