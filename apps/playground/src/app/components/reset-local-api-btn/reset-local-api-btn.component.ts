import { APP_BASE_HREF } from '@angular/common';
import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { ButtonModule, ModalModule } from 'carbon-components-angular';

import { RemoteResourceTemplatesAPIService } from '../../services/remote-resource-templates-api.service';
import { RemoteResourceTemplatesLocalAPIService } from '../../services/remote-resource-templates-local-api.service';
import { UIElementTemplatesAPIService } from '../../services/ui-element-templates-api.service';
import { UIElementTemplatesLocalAPIService } from '../../services/ui-element-templates-local-api.service';

@Component({
  selector: 'app-reset-local-api-btn',
  imports: [ButtonModule, ModalModule],
  templateUrl: './reset-local-api-btn.component.html',
  styleUrl: './reset-local-api-btn.component.scss',
})
export class ResetLocalApiBtnComponent {
  readonly #remoteResourceTemplatesLocalAPIService = inject(
    RemoteResourceTemplatesAPIService
  ) as RemoteResourceTemplatesLocalAPIService;
  readonly #uiElementTemplatesLocalAPIService = inject(
    UIElementTemplatesAPIService
  ) as UIElementTemplatesLocalAPIService;
  readonly #document = inject(DOCUMENT);
  readonly #appBaseHref = inject(APP_BASE_HREF, { optional: true }) ?? '';

  isConfirmationModalOpenSig = signal<boolean>(false);

  async resetLocalAPI(): Promise<void> {
    await this.#uiElementTemplatesLocalAPIService.resetTemplates();
    await this.#remoteResourceTemplatesLocalAPIService.resetTemplates();
    this.#document.location.href = this.#appBaseHref;
  }
}
