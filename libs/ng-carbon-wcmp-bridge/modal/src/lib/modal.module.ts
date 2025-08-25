import { NgModule } from '@angular/core';

import { CDSModalDirective } from './modal.directive';
import { CDSModalBodyDirective } from './modal-body.directive';
import { CDSModalBodyContentDirective } from './modal-body-content.directive';

@NgModule({
  imports: [CDSModalDirective, CDSModalBodyDirective, CDSModalBodyContentDirective],
  exports: [CDSModalDirective, CDSModalBodyDirective, CDSModalBodyContentDirective],
})
export class CDSModalModule {}
