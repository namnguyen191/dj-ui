import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UiElementWrapperComponent } from '@dj-ui/core';
import { Button } from 'primeng/button';
import { map } from 'rxjs';

import { UIElementTemplatesStore } from '../../../../state-stores/uiElementTemplates.store';
import { BuilderDJUIConfigModule } from '../../builder-dj-ui-config.module';
import { RawTemplateEditorModalComponent } from './components/raw-template-editor-modal.component';

@Component({
  selector: 'namnguyen191-edit-ui-element-template',
  imports: [
    BuilderDJUIConfigModule,
    UiElementWrapperComponent,
    RawTemplateEditorModalComponent,
    Button,
  ],
  templateUrl: './edit-ui-element-template.component.html',
  styleUrl: './edit-ui-element-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUIElementTemplateComponent {
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
