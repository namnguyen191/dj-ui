import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ELEMENT_RENDERER_CONFIG,
  type ElementRendererConfig,
  UIElementRendererDirective,
} from '@dj-ui/core';
import { UIElementTemplatesStore } from '@dj-ui/prime-ng-playground/shared';
import { Button } from 'primeng/button';
import { map } from 'rxjs';

import { RawTemplateEditorModalComponent } from '../../shared/components/raw-template-editor-modal/raw-template-editor-modal.component';
import { LayoutEditorContextMenuComponent } from './layout-editor-context-menu/layout-editor-context-menu.component';

@Component({
  selector: 'prime-ng-playground-builder-feat-edit-layout-template',
  imports: [UIElementRendererDirective, RawTemplateEditorModalComponent, Button],
  providers: [
    {
      provide: ELEMENT_RENDERER_CONFIG,
      useFactory: (): ElementRendererConfig => {
        return {
          uiElementWrapperComponent: LayoutEditorContextMenuComponent,
        };
      },
    },
  ],
  templateUrl: './edit-layout-template.component.html',
  styleUrl: './edit-layout-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLayoutTemplateComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  readonly currentUIElementTemplateId: string = this.#activatedRoute.snapshot.params[
    'id'
  ] as string;
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
    this.#uiElementTemplatesStore.updateQuery({
      id: this.currentUIElementTemplateId,
    });
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
}
