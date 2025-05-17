import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  BaseModal,
  ButtonModule,
  InlineLoadingModule,
  LoadingModule,
  ModalModule,
} from 'carbon-components-angular';
import { editor } from 'monaco-editor';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import type { Plugin } from 'prettier';
import * as parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';
import { debounceTime, Subject, tap } from 'rxjs';

import type {
  AppUIElementTemplateEditableFields,
  AppUIElementTemplateUnEditableFields,
} from '../../../../../shared/dj-ui-app-template';
import { UIElementTemplatesStore } from '../../../../../state-store/uiElementTemplates.store';

export type IStandaloneEditorConstructionOptions = NonNullable<Parameters<typeof editor.create>[1]>;

@Component({
  selector: 'namnguyen191-raw-template-editor-modal',
  imports: [
    CommonModule,
    ModalModule,
    EditorComponent,
    FormsModule,
    LoadingModule,
    ButtonModule,
    InlineLoadingModule,
  ],
  templateUrl: './raw-template-editor-modal.component.html',
  styleUrl: './raw-template-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawTemplateEditorModalComponent extends BaseModal {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);

  readonly loadingSig = this.#uiElementTemplatesStore.isPending;

  readonly codeChangeSubject = new Subject<string>();
  readonly editorOptions: IStandaloneEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'json',
    wordWrap: 'on',
  };
  codeSig = signal<string>('');
  readonly errorStateSig = signal<'noError' | 'isError' | 'isPending'>('noError');
  #originalCode = '';
  readonly #templateEditableFields = computed<AppUIElementTemplateEditableFields | null>(() => {
    const currentTemplate = this.#uiElementTemplatesStore.filteredUIElementTemplates()[0];
    if (!currentTemplate) {
      return null;
    }
    return {
      name: currentTemplate.name,
      description: currentTemplate.description,
      options: currentTemplate.options,
      remoteResourceIds: currentTemplate.remoteResourceIds,
      stateSubscription: currentTemplate.stateSubscription,
      eventsHooks: currentTemplate.eventsHooks,
    };
  });

  readonly #templateUnEditableFields = computed<AppUIElementTemplateUnEditableFields | null>(() => {
    const currentTemplate = this.#uiElementTemplatesStore.filteredUIElementTemplates()[0];
    if (!currentTemplate) {
      return null;
    }
    return {
      id: currentTemplate.id,
      type: currentTemplate.type,
      updatedAt: currentTemplate.updatedAt,
      createdAt: currentTemplate.createdAt,
    };
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #codeChangeSubscription = this.codeChangeSubject
    .pipe(
      tap({
        next: () => {
          this.errorStateSig.set('isPending');
        },
      }),
      debounceTime(500),
      tap({
        next: (code) => {
          this.codeSig.set(code);
          if (this.#isValidCode(code)) {
            this.errorStateSig.set('noError');
          } else {
            this.errorStateSig.set('isError');
          }
        },
      }),
      takeUntilDestroyed()
    )
    .subscribe();

  async updateUIElementTemplate(): Promise<void> {
    const templateUnEditableFields = untracked(this.#templateUnEditableFields);

    if (!templateUnEditableFields) {
      return;
    }

    const templateFromCode = JSON.parse(
      untracked(this.codeSig)
    ) as AppUIElementTemplateEditableFields;

    await this.#uiElementTemplatesStore.change({
      ...templateUnEditableFields,
      ...templateFromCode,
    });
    if (!untracked(this.#uiElementTemplatesStore.error)) {
      this.closeModal();
    }
  }

  // eslint-disable-next-line no-unused-private-class-members, @typescript-eslint/no-misused-promises
  #loadTemplateIntoCodeEffect = effect(async () => {
    const currentEditableTemplate = this.#templateEditableFields();
    if (!currentEditableTemplate) {
      return;
    }

    const rawJSON = JSON.stringify(currentEditableTemplate);
    const prettifyJSON = await this.#formatJSON(rawJSON);
    this.#originalCode = prettifyJSON;
    this.codeSig.set(prettifyJSON);
  });

  async #formatJSON(rawJSON: string): Promise<string> {
    const formatted = await prettier.format(rawJSON, {
      parser: 'json',
      plugins: [parserBabel, prettierPluginEstree as Plugin],
    });

    return formatted;
  }

  #isValidCode(code: string): boolean {
    try {
      JSON.parse(code);
      return true;
    } catch (err) {
      console.log('Something went wrong:', err);
      return false;
    }
  }

  override closeModal(): void {
    this.codeSig.set(this.#originalCode);
    super.closeModal();
  }
}
