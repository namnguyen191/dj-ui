import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Edit16 from '@carbon/icons/es/edit/16';
import { SimpleGridLayoutComponent } from '@dj-ui/common';
import { CORE_LAYOUT_CONFIG, type CoreLayoutConfig } from '@dj-ui/core';
import { ButtonModule } from 'carbon-components-angular/button';
import { IconModule, IconService } from 'carbon-components-angular/icon';
import { map } from 'rxjs';

import { DuiUIElementBuilderContextMenuWrapperComponent } from '../../../../components/dui-ui-element-builder-context-menu-wrapper/dui-ui-element-builder-context-menu-wrapper.component';
import { LayoutTemplatesStore } from '../../../../state-store/layoutTemplates.store';
import { LayoutTemplateEditorStore } from '../../../../state-store/uiLayoutTemplateEditor.store';
import { LayoutTemplateCodeEditorModalComponent } from './components/layout-template-code-editor-modal/layout-template-code-editor-modal.component';

@Component({
  selector: 'namnguyen191-edit-layout-page',
  imports: [
    FormsModule,
    ButtonModule,
    IconModule,
    LayoutTemplateCodeEditorModalComponent,
    SimpleGridLayoutComponent,
  ],
  providers: [
    {
      provide: CORE_LAYOUT_CONFIG,
      useFactory: (): CoreLayoutConfig => {
        const existingConfigs = inject(CORE_LAYOUT_CONFIG, {
          skipSelf: true,
        });
        return {
          ...existingConfigs,
          uiElementExtraWrapperComponent: DuiUIElementBuilderContextMenuWrapperComponent,
        };
      },
    },
  ],
  templateUrl: './edit-layout-page.component.html',
  styleUrl: './edit-layout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLayoutPageComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #layoutTemplatesStore = inject(LayoutTemplatesStore);
  readonly #layoutTemplateEditorStore = inject(LayoutTemplateEditorStore);
  readonly #iconService = inject(IconService);

  readonly currentLayoutTemplateId: string = this.#activatedRoute.snapshot.params['id'] as string;
  readonly #showEditModalQueryParam = 'editRawTemplate';
  readonly isRawTemplateEditorModalOpenSig = toSignal(
    this.#activatedRoute.queryParams.pipe(
      map((params) => params[this.#showEditModalQueryParam] === 'true')
    ),
    {
      initialValue: false,
    }
  );

  constructor() {
    this.#iconService.registerAll([Edit16] as object[]);
    this.#layoutTemplatesStore.updateQuery({ id: this.currentLayoutTemplateId });

    this.#loadTemplateInPreview();
  }

  toggleModal(show: boolean): void {
    void this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams: {
        [this.#showEditModalQueryParam]: show ? true : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  #loadTemplateInPreview(): void {
    effect(() => {
      const layoutTemplate = this.#layoutTemplatesStore.filteredLayoutTemplates()[0];
      if (!layoutTemplate) {
        return;
      }

      this.#layoutTemplateEditorStore.setCurrentEditingTemplate(layoutTemplate);
    });
  }
}
