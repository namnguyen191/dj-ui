import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  layoutUIElement,
  type TemplateInfo,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'prime-ng-playground-builder-feat-layouts-list',
  imports: [TableModule, ButtonModule, ConfirmDialog, CommonModule],
  providers: [ConfirmationService],
  templateUrl: './layouts-list.component.html',
  styleUrl: './layouts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutsListComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  protected loadingSig = this.#uiElementTemplatesStore.isPending;
  allLayoutTemplatesInfoSig: Signal<TemplateInfo[]> = computed(() => {
    const allTemplatesInfo = this.#uiElementTemplatesStore.allUIElementTemplatesInfo();

    return allTemplatesInfo.filter((tempInfo) => layoutUIElement.has(tempInfo.type));
  });

  navigateToEditPage(uieTemplateId: string): void {
    void this.#router.navigate(['.', uieTemplateId], { relativeTo: this.#activatedRoute });
  }
}
