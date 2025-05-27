import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  type Signal,
  untracked,
} from '@angular/core';
import { RemoteResourceTemplateService } from '@dj-ui/core';
import {
  type AppRemoteResourceTemplate,
  type AppRemoteResourceTemplateEditableFields,
  RemoteResourceTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import AppEditRemoteResourceSchema from '@dj-ui/prime-ng-playground/shared/generated-json-schemas/AppEditRemoteResourceSchema.json';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import {
  JsonEditorModalComponent,
  type JsonSchemaConfig,
} from '../json-editor-modal/json-editor-modal.component';

@Component({
  selector: 'prime-ng-playground-builder-feat-raw-remote-resource-template-editor-modal',
  imports: [JsonEditorModalComponent, Toast],
  providers: [MessageService],
  templateUrl: './raw-remote-resource-template-editor-modal.component.html',
  styleUrl: './raw-remote-resource-template-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawRemoteResourceTemplateEditorModalComponent {
  readonly #remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);
  readonly #remoteResourceTemplateService = inject(RemoteResourceTemplateService);
  readonly #messageService = inject(MessageService);

  readonly id = input.required<string>();
  readonly visible = input.required<boolean>();

  readonly editCancel = output();

  protected readonly loadingSig = computed<boolean>(() => {
    return this.#remoteResourceTemplatesStore.isPending();
  });

  protected readonly jsonSchemaConfig: JsonSchemaConfig = {
    schema: AppEditRemoteResourceSchema,
    schemaId: 'remoteResourceEditSchema',
  };

  readonly #templatesFilteredByIdSig: Signal<AppRemoteResourceTemplate[]> = computed(() => {
    const templateId = this.id();

    return this.#remoteResourceTemplatesStore
      .entities()
      .filter((template) => template.id === templateId);
  });
  readonly #currentTemplateSig: Signal<AppRemoteResourceTemplate | null> = computed(() => {
    const templatesFilteredById = this.#templatesFilteredByIdSig();

    if (templatesFilteredById.length <= 0) {
      return null;
    }

    if (templatesFilteredById.length > 1) {
      console.warn(
        `Multiple UIE templates with the same ID of ${untracked(this.id)} detected. This could be an error. The first one will be selected for editing`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return templatesFilteredById[0]!;
  });

  protected readonly currentEditableFieldsSig: Signal<AppRemoteResourceTemplateEditableFields | null> =
    computed(() => {
      const currentTemplate = this.#currentTemplateSig();

      if (!currentTemplate) {
        return null;
      }

      const { name, description, stateSubscription, options } = currentTemplate;
      return {
        name,
        description,
        stateSubscription,
        options,
      };
    });

  async updateUIElementTemplate(rawJSONCode: string): Promise<void> {
    const templateFromCode = JSON.parse(rawJSONCode) as AppRemoteResourceTemplateEditableFields;

    const currentTemplate = untracked(this.#currentTemplateSig);

    if (!currentTemplate) {
      return;
    }

    const updatedTemplate = {
      ...currentTemplate,
      ...templateFromCode,
    };
    await this.#remoteResourceTemplatesStore.change(updatedTemplate);

    if (!untracked(this.#remoteResourceTemplatesStore.error)) {
      this.#messageService.add({
        severity: 'success',
        summary: 'Template saved successfully',
        detail: 'Your remote resource template has been successfully saved',
        life: 3000,
      });
      this.#remoteResourceTemplateService.updateTemplate(updatedTemplate);
    } else {
      this.#messageService.add({
        severity: 'error',
        summary: 'Template saved failure',
        detail:
          'Your remote resource template could not be saved, please try again later or refresh the page',
        life: 9999,
      });
    }
  }
}
