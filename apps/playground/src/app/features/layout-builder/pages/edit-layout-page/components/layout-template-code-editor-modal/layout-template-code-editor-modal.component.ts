import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { Plugin } from 'prettier';
import * as parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';
import { debounceTime, Subject, tap } from 'rxjs';

import { AppLayoutTemplateEditableFields } from '../../../../../../shared/dj-ui-app-template';
import { LayoutTemplatesStore } from '../../../../../../state-store/layoutTemplates.store';
import { LayoutTemplateEditorStore } from '../../../../../../state-store/uiLayoutTemplateEditor.store';

export type IStandaloneEditorConstructionOptions = NonNullable<Parameters<typeof editor.create>[1]>;

@Component({
  selector: 'namnguyen191-layout-template-code-editor-modal',
  imports: [
    CommonModule,
    ModalModule,
    EditorComponent,
    FormsModule,
    LoadingModule,
    ButtonModule,
    InlineLoadingModule,
  ],
  templateUrl: './layout-template-code-editor-modal.component.html',
  styleUrl: './layout-template-code-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTemplateCodeEditorModalComponent extends BaseModal {
  readonly #layoutTemplatesStore = inject(LayoutTemplatesStore);
  readonly #layoutTemplateEditorStore = inject(LayoutTemplateEditorStore);

  readonly loadingSig = this.#layoutTemplatesStore.isPending;

  readonly codeChangeSubject = new Subject<string>();
  readonly editorOptions: IStandaloneEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'json',
    wordWrap: 'on',
  };
  codeSig = signal<string>('');
  readonly errorStateSig = signal<'noError' | 'isError' | 'isPending'>('noError');
  #originalCode = '';

  constructor() {
    super();
    this.codeChangeSubject
      .pipe(
        tap({
          next: () => this.errorStateSig.set('isPending'),
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

    this.#loadTemplateIntoCode();
  }

  async updateLayoutTemplate(): Promise<void> {
    const templateFromCode = JSON.parse(untracked(this.codeSig)) as AppLayoutTemplateEditableFields;

    this.#layoutTemplateEditorStore.updateCurrentEditingTemplate(templateFromCode);
    const latestEditedTemplated = untracked(this.#layoutTemplateEditorStore.currentEditingTemplate);

    if (!latestEditedTemplated) {
      console.error('Edited template is missing from store');
      return;
    }

    await this.#layoutTemplatesStore.change(latestEditedTemplated);
    if (!untracked(this.#layoutTemplatesStore.error)) {
      this.closeModal();
    }
  }

  #loadTemplateIntoCode(): void {
    effect(async () => {
      const currentEditableTemplate = this.#layoutTemplateEditorStore.currentEditableFields();
      if (!currentEditableTemplate) {
        return;
      }

      const rawJSON = JSON.stringify(currentEditableTemplate);
      const prettifyJSON = await this.#formatJSON(rawJSON);
      this.#originalCode = prettifyJSON;
      this.codeSig.set(prettifyJSON);
    });
  }

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
