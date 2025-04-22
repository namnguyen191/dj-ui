import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RemoteResourceTemplatesStore,
  type TemplateInfo,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'prime-ng-playground-builder-feat-ui-element-list',
  imports: [TableModule, ButtonModule, ConfirmDialog, CommonModule],
  providers: [ConfirmationService],
  templateUrl: './ui-element-list.component.html',
  styleUrl: './ui-element-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIElementListComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  protected loadingSig = this.#uiElementTemplatesStore.isPending;
  allTemplatesInfoSig: Signal<TemplateInfo[]> =
    this.#uiElementTemplatesStore.allUIElementTemplatesInfo;

  navigateToEditPage(uieTemplateId: string): void {
    this.#router.navigate(['.', uieTemplateId], { relativeTo: this.#activatedRoute });
  }

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
        void this.#remoteResourceTemplatesStore.resetMockTemplates();
      },
    });
  }
}
