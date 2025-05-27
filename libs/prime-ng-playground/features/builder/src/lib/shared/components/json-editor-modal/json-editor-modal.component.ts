import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  resource,
  type ResourceRef,
  signal,
  type WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  type JSONCodeEditorConfigs,
  JsonEditorComponent,
  MonacoEditorService,
} from '@dj-ui/prime-ng-playground/shared';
import { isEqual } from 'lodash-es';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import type { UnknownRecord } from 'type-fest';

import { formatJSON } from '../../editor-utils';

export type JsonSchemaConfig = {
  schemaId: string;
  schema: unknown;
};

@Component({
  selector: 'prime-ng-playground-builder-feat-json-editor-modal',
  imports: [CommonModule, JsonEditorComponent, Dialog, Button, ProgressSpinner, FormsModule],
  templateUrl: './json-editor-modal.component.html',
  styleUrl: './json-editor-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorModalComponent {
  readonly #monacoEditorService = inject(MonacoEditorService);

  readonly isOpen = input<boolean>(false);
  readonly jsonObj = input.required<UnknownRecord>();
  readonly isLoading = input<boolean>(false);
  readonly schemaConfig = input<JsonSchemaConfig>();

  readonly editCancel = output();
  readonly save = output<string>();

  readonly errorStateSig = signal<'noError' | 'isError'>('noError');

  protected readonly prettifiedJSONResource: ResourceRef<string | undefined> = resource({
    request: () => ({ jsonObj: this.jsonObj() }),
    equal: isEqual,
    loader: ({ request }) => {
      const { jsonObj } = request;
      const rawJSON = JSON.stringify(jsonObj);
      return formatJSON(rawJSON);
    },
  });

  protected readonly codeEditorConfigsSig: WritableSignal<JSONCodeEditorConfigs | null> =
    linkedSignal(() => {
      const prettifiedInitialCodes = this.prettifiedJSONResource.value();
      const schemaConfig = this.schemaConfig();
      if (prettifiedInitialCodes === undefined) {
        return null;
      }

      return {
        schemaId: schemaConfig?.schemaId,
        initialValue: prettifiedInitialCodes,
      };
    });

  protected readonly codeSig = linkedSignal<string>(() => {
    const codeEditorConfigs = this.codeEditorConfigsSig();
    return codeEditorConfigs?.initialValue ?? '{}';
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #fetchJSONSchemaEffect = effect(() => {
    const schemaConfig = this.schemaConfig();

    if (!schemaConfig) {
      return;
    }

    void this.#registerJSONSchema(schemaConfig);
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #setErrorOnCodeChangeEffect = effect(() => {
    const code = this.codeSig();
    if (this.#isValidCode(code)) {
      this.errorStateSig.set('noError');
    } else {
      this.errorStateSig.set('isError');
    }
  });

  protected emitCancelAndResetToInitialCode(): void {
    const prettifiedInitialCode = this.prettifiedJSONResource.value();
    if (prettifiedInitialCode !== undefined) {
      this.codeEditorConfigsSig.update((prev) => ({
        ...prev,
        initialValue: prettifiedInitialCode,
      }));
    }
    this.editCancel.emit();
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

  async #registerJSONSchema(jsonSchemaConfig: JsonSchemaConfig): Promise<void> {
    const { schema, schemaId } = jsonSchemaConfig;

    try {
      await this.#monacoEditorService.registerJSONSchema({
        schemaId,
        schemaFetcher: () => Promise.resolve(schema),
      });
    } catch (error) {
      console.error(
        'Could not fetch and register JSON schema, editor will not have auto complete: ',
        error
      );
    }
  }
}
