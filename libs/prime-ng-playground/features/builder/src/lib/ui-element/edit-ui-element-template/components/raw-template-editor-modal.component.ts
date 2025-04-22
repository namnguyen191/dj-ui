import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  type Signal,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { UIElementTemplateService } from '@dj-ui/core';
import {
  type AppUIElementTemplate,
  type AppUIElementTemplateEditableFields,
  CodeEditorComponent,
  type CodeEditorConfigs,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import type { Plugin } from 'prettier';
import * as parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { filter, from, map, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'prime-ng-playground-builder-feat-raw-template-editor-modal',
  imports: [CommonModule, CodeEditorComponent, Dialog, Button, ProgressSpinner, FormsModule, Toast],
  providers: [MessageService],
  templateUrl: './raw-template-editor-modal.component.html',
  styleUrl: './raw-template-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawTemplateEditorModalComponent {
  readonly #uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #uiElementTemplateService = inject(UIElementTemplateService);

  readonly #messageService = inject(MessageService);

  readonly visible = input.required<boolean>();

  readonly editCancel = output<void>();

  readonly loadingSig = this.#uiElementTemplatesStore.isPending;

  protected readonly codeChangeSubject = new Subject<string>();
  readonly errorStateSig = signal<'noError' | 'isError' | 'isPending'>('noError');

  readonly #currentTemplateSig: Signal<AppUIElementTemplate | null> = computed(() => {
    const filteredTemplates = this.#uiElementTemplatesStore.filteredUIElementTemplates();
    if (filteredTemplates.length <= 0) {
      return null;
    }

    if (filteredTemplates.length > 1) {
      console.warn(
        'Multiple UIE templates with the same ID detected. This could be an error. The first one will be selected for editing'
      );
    }

    return filteredTemplates[0] ?? null;
  });

  readonly #currentEditableFieldsSig: Signal<AppUIElementTemplateEditableFields | null> = computed(
    () => {
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
    }
  );

  protected readonly codeEditorConfigsSig: Signal<CodeEditorConfigs | null> = toSignal(
    toObservable(this.#currentEditableFieldsSig).pipe(
      filter((editableFields) => editableFields !== null),
      switchMap((editableFields) => {
        const rawJSON = JSON.stringify(editableFields);
        return from(this.#formatJSON(rawJSON));
      }),
      map(
        (prettifiedEditableFields) =>
          ({
            language: 'json',
            initialValue: prettifiedEditableFields,
          }) as CodeEditorConfigs
      )
    ),
    {
      initialValue: null,
    }
  );

  readonly #codeSig = linkedSignal<string>(() => {
    const codeEditorConfigs = this.codeEditorConfigsSig();

    return codeEditorConfigs?.initialValue ?? '';
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #processCodeChange = this.codeChangeSubject
    .pipe(
      tap({
        next: () => {
          this.errorStateSig.set('isPending');
        },
      }),
      tap({
        next: (code) => {
          this.#codeSig.set(code);
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
    const templateFromCode = JSON.parse(
      untracked(this.#codeSig)
    ) as AppUIElementTemplateEditableFields;

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
}
