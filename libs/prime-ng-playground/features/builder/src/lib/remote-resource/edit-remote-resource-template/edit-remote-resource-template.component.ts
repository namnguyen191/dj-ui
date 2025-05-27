import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  type ResourceRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteResourceService } from '@dj-ui/core';
import { type JSONCodeEditorConfigs, JsonEditorComponent } from '@dj-ui/prime-ng-playground/shared';
import { Button } from 'primeng/button';
import { map } from 'rxjs';

import { RawRemoteResourceTemplateEditorModalComponent } from '../../shared/components/raw-remote-resource-template-editor-modal/raw-remote-resource-template-editor-modal.component';
import { formatJSON } from '../../shared/editor-utils';

@Component({
  selector: 'prime-ng-playground-builder-feat-edit-remote-resource-template',
  imports: [RawRemoteResourceTemplateEditorModalComponent, Button, JsonEditorComponent],
  templateUrl: './edit-remote-resource-template.component.html',
  styleUrl: './edit-remote-resource-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRemoteResourceTemplateComponent {
  readonly #remoteResourceService = inject(RemoteResourceService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected readonly currentRemoteResourceTemplateId: string = this.#activatedRoute.snapshot.params[
    'id'
  ] as string;
  protected remoteResourceStateSig = toSignal(
    this.#remoteResourceService.getRemoteResourceState(this.currentRemoteResourceTemplateId)
  );
  readonly #showEditModalQueryParam = 'editRawTemplate';
  readonly isRawTemplateEditorModalOpenSig = toSignal(
    this.#activatedRoute.queryParams.pipe(
      map((params) => params[this.#showEditModalQueryParam] === 'true')
    ),
    {
      initialValue: false,
    }
  );

  protected readonly editorConfig: JSONCodeEditorConfigs = {
    readonly: true,
  };

  readonly #prettifiedRemoteResourceResult: ResourceRef<string | undefined> = resource({
    request: () => ({ remoteResourceState: this.remoteResourceStateSig() }),
    loader: ({ request }) => {
      const { remoteResourceState } = request;

      if (!remoteResourceState || remoteResourceState.status !== 'completed') {
        return Promise.resolve(undefined);
      }

      return formatJSON(JSON.stringify(remoteResourceState.result));
    },
  });
  protected readonly editorConfigSig = computed<JSONCodeEditorConfigs | null>(() => {
    const prettifiedRemoteResourceResult = this.#prettifiedRemoteResourceResult.value();

    if (!prettifiedRemoteResourceResult) {
      return null;
    }

    return {
      readonly: true,
      initialValue: prettifiedRemoteResourceResult,
    };
  });

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
