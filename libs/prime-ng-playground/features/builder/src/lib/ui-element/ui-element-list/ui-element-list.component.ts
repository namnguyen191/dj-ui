import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type Signal,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  layoutUIElement,
  RemoteResourceTemplatesStore,
  type TemplateInfo,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { ConfirmationService, type MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'prime-ng-playground-builder-feat-ui-element-list',
  imports: [TableModule, Button, ConfirmDialog, CommonModule, RouterLink, ContextMenuModule],
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

  protected readonly selectedTemplateSig = signal<TemplateInfo | null>(null);
  protected readonly tableRowContextMenuItems: MenuItem[] = [
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (): void => {
        const selectedTemplate = untracked(this.selectedTemplateSig);
        if (!selectedTemplate) {
          console.warn('Trying to delete but template has not been selected');
          return;
        }
        this.confirmDeleteTemplate(selectedTemplate.id);
      },
    },
  ];

  protected loadingSig = this.#uiElementTemplatesStore.isPending;
  allTemplatesInfoSig: Signal<TemplateInfo[]> = computed(() => {
    const allTemplatesInfo = this.#uiElementTemplatesStore.allUIElementTemplatesInfo();

    return allTemplatesInfo.filter((tempInfo) => !layoutUIElement.has(tempInfo.type));
  });

  navigateToEditPage(uieTemplateId: string): void {
    void this.#router.navigate(['.', uieTemplateId], { relativeTo: this.#activatedRoute });
  }

  navigateToCreatePage(): void {
    void this.#router.navigate(['.', 'create'], { relativeTo: this.#activatedRoute });
  }

  confirmDeleteTemplate(templateId: string): void {
    this.#confirmationService.confirm({
      message: `Are you sure you want to delete template "${templateId}"?`,
      header: 'Deletion confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        void this.#uiElementTemplatesStore.delete(templateId);
      },
    });
  }

  confirmResetMockTemplates(event: Event): void {
    this.#confirmationService.confirm({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: event.target!,
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
