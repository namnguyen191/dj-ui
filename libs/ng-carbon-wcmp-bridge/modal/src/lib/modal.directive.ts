import '@carbon/web-components/es/components/modal/modal.js';

import { Directive, input, output } from '@angular/core';
import type CDSModal from '@carbon/web-components/es/components/modal/modal.js';
import {
  CDSBaseDirective,
  type CDSDirectiveImpl,
  type ModalBeingClosedEvent,
  type ModalSize,
} from '@dj-ui/ng-carbon-wcmp-bridge/shared';

@Directive({
  selector: 'cds-modal',
})
export class CDSModalDirective
  extends CDSBaseDirective<CDSModal>
  implements CDSDirectiveImpl<CDSModal>
{
  alert = input<boolean>();
  containerClass = input<string>();
  fullWidth = input<boolean>();
  hasScrollingContent = input<boolean>();
  size = input<ModalSize>();
  preventCloseOnClickOutside = input<boolean>();
  preventClose = input<boolean>();
  open = input<boolean>();

  'cds-modal-beingclosed' = output<ModalBeingClosedEvent>();
}
