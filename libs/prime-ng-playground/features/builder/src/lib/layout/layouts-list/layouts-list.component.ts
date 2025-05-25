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
  type TemplateInfo,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { ConfirmationService, type MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ContextMenu } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'prime-ng-playground-builder-feat-layouts-list',
  imports: [TableModule, ButtonModule, ConfirmDialog, CommonModule, ContextMenu, RouterLink],
  providers: [ConfirmationService],
  templateUrl: './layouts-list.component.html',
  styleUrl: './layouts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutsListComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #confirmationService = inject(ConfirmationService);

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
  allLayoutTemplatesInfoSig: Signal<TemplateInfo[]> = computed(() => {
    const allTemplatesInfo = this.#uiElementTemplatesStore.allUIElementTemplatesInfo();

    return allTemplatesInfo.filter((tempInfo) => layoutUIElement.has(tempInfo.type));
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
}
