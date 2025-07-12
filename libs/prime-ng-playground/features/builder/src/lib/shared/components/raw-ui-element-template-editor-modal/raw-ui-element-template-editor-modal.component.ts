import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  resource,
  type ResourceRef,
  type Signal,
  untracked,
} from '@angular/core';
import { SimpleGridLayoutElementType } from '@dj-ui/common/shared';
import { UIElementTemplateService } from '@dj-ui/core';
import {
  CardElementType,
  ImagesCarouselElementType,
  SimpleImageElementType,
  SimpleTableElementType,
  SimpleTextElementType,
} from '@dj-ui/prime-ng-ext/shared';
import {
  type AppUIElementTemplate,
  type AppUIElementTemplateEditableFields,
  type FilterQuery,
  filterTemplatesByQuery,
  UIElementTemplatesStore,
  type UIElementType,
} from '@dj-ui/prime-ng-playground/shared';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';

import {
  JsonEditorModalComponent,
  type JsonSchemaConfig,
} from '../json-editor-modal/json-editor-modal.component';

type ElementTypeToSchemaUrl = {
  [K in UIElementType]: string;
};
const BASE_SCHEMA_URL = 'dj-ui-schemas';
const ELEMENT_TYPE_TO_SCHEMA_URL: ElementTypeToSchemaUrl = {
  [SimpleTableElementType]: `${BASE_SCHEMA_URL}/AppEditPrimeNgSimpleTableUIESchema.json`,
  [SimpleTextElementType]: `${BASE_SCHEMA_URL}/AppEditPrimeNgSimpleTextUIESchema.json`,
  [SimpleImageElementType]: `${BASE_SCHEMA_URL}/AppEditPrimeNgSimpleImageUIESchema.json`,
  [SimpleGridLayoutElementType]: `${BASE_SCHEMA_URL}/AppEditSimpleGridUIESchema.json`,
  [ImagesCarouselElementType]: `${BASE_SCHEMA_URL}/AppEditPrimeNgImagesCarouselUIESchema.json`,
  [CardElementType]: `${BASE_SCHEMA_URL}/AppEditPrimeNgCardUIESchema.json`,
};
type ElementType = keyof typeof ELEMENT_TYPE_TO_SCHEMA_URL;

@Component({
  selector: 'prime-ng-playground-builder-feat-raw-ui-element-template-editor-modal',
  imports: [JsonEditorModalComponent, Toast],
  providers: [MessageService],
  templateUrl: './raw-ui-element-template-editor-modal.component.html',
  styleUrl: './raw-ui-element-template-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawUIElementTemplateEditorModalComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #uiElementTemplateService = inject(UIElementTemplateService);
  readonly #messageService = inject(MessageService);
  readonly #httpClient = inject(HttpClient);

  readonly query = input.required<Required<FilterQuery>>();
  readonly visible = input.required<boolean>();

  readonly editCancel = output();

  readonly loadingSig = computed<boolean>(() => {
    return this.#uiElementTemplatesStore.isPending() || this.jsonSchemaConfigResource.isLoading();
  });

  protected readonly jsonSchemaConfigResource: ResourceRef<JsonSchemaConfig | undefined> = resource(
    {
      params: () => ({
        uiElementType: this.#currentTemplateSig()?.type,
      }),
      loader: async ({ params }) => {
        const { uiElementType } = params;

        if (!uiElementType) {
          return undefined;
        }

        const schema = await firstValueFrom(
          this.#httpClient.get<unknown>(ELEMENT_TYPE_TO_SCHEMA_URL[uiElementType as ElementType])
        );

        return {
          schema,
          schemaId: uiElementType,
        };
      },
    }
  );

  readonly #templatesFilteredByIdSig: Signal<AppUIElementTemplate[]> = computed(() => {
    const query = untracked(this.query);

    return this.#uiElementTemplatesStore.entities().filter(filterTemplatesByQuery(query));
  });
  readonly #currentTemplateSig: Signal<AppUIElementTemplate | null> = computed(() => {
    const templatesFilteredById = this.#templatesFilteredByIdSig();

    if (templatesFilteredById.length <= 0) {
      return null;
    }

    if (templatesFilteredById.length > 1) {
      console.warn(
        `Multiple UIE templates with the same ID of ${untracked(this.query).id} detected. This could be an error. The first one will be selected for editing`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return templatesFilteredById[0]!;
  });

  protected readonly currentEditableFieldsSig: Signal<AppUIElementTemplateEditableFields | null> =
    computed(() => {
      const currentTemplate = this.#currentTemplateSig();

      if (!currentTemplate) {
        return null;
      }

      const { name, description, remoteResourceIds, stateSubscription, options, eventsHooks } =
        currentTemplate;
      return {
        name,
        description,
        remoteResourceIds,
        stateSubscription,
        options,
        eventsHooks,
      };
    });

  async updateUIElementTemplate(rawJSONCode: string): Promise<void> {
    const templateFromCode = JSON.parse(rawJSONCode) as AppUIElementTemplateEditableFields;

    const currentTemplate = untracked(this.#currentTemplateSig);

    if (!currentTemplate) {
      return;
    }

    const updatedTemplate = {
      ...currentTemplate,
      ...templateFromCode,
    };
    await this.#uiElementTemplatesStore.change(updatedTemplate);

    if (!untracked(this.#uiElementTemplatesStore.error)) {
      this.#messageService.add({
        severity: 'success',
        summary: 'Template saved successfully',
        detail: 'Your UIE template has been successfully saved',
        life: 3000,
      });
      this.#uiElementTemplateService.updateTemplate(updatedTemplate);
    } else {
      this.#messageService.add({
        severity: 'error',
        summary: 'Template saved failure',
        detail: 'Your UIE template could not be saved, please try again later or refresh the page',
        life: 9999,
      });
    }
  }
}
