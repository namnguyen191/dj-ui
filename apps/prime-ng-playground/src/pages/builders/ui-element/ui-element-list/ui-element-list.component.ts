import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

import type { TemplateInfo } from '../../../../shared/app-template';
import { UIElementTemplatesStore } from '../../../../state-stores/uiElementTemplates.store';

@Component({
  selector: 'app-ui-element-list',
  imports: [TableModule, ButtonModule, ConfirmDialog, CommonModule],
  providers: [ConfirmationService],
  templateUrl: './ui-element-list.component.html',
  styleUrl: './ui-element-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIElementListComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #confirmationService = inject(ConfirmationService);

  protected loadingSig = this.#uiElementTemplatesStore.isPending;
  allTemplatesInfoSig: Signal<TemplateInfo[]> =
    this.#uiElementTemplatesStore.allUIElementTemplatesInfo;

  confirmResetMockTemplates(event: Event): void {
    this.#confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure that you want to proceed? This will reset all the mock templates, including ones that have been modified by the user.',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Proceed',
        severity: 'danger',
      },
      accept: () => {
        void this.#uiElementTemplatesStore.resetMockTemplates();
      },
    });
  }
}
