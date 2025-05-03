import { Injectable, signal, type WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import loader from '@monaco-editor/loader';
import type { editor } from 'monaco-editor';
import { filter, firstValueFrom, Observable } from 'rxjs';

export type MonacoAPI = typeof import('monaco-editor/esm/vs/editor/editor.api');

export type MonacoEditorAPI = typeof editor;

export type IStandaloneEditorConstructionOptions = NonNullable<
  Parameters<MonacoEditorAPI['create']>[1]
>;

export type MonacoEditorInstance = ReturnType<MonacoEditorAPI['create']>;

export type JSONSchemaConfig = {
  uri: string;
  fileMatch: string[];
  schema: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class MonacoEditorService {
  readonly #monacoSig: WritableSignal<MonacoAPI | null> = signal(null);
  readonly #monaco$: Observable<MonacoAPI> = toObservable(this.#monacoSig).pipe(
    filter((val) => val !== null)
  );
  #jsonSchemas: Record<string, unknown> = {};

  constructor() {
    this.#init();
  }

  #init(): void {
    loader.init().then((monaco) => {
      this.#monacoSig.set(monaco);
    });
  }

  #getJSONSchemaURI(schemId: string): string {
    return `inmemory://model/${schemId}.json`;
  }

  async registerJSONSchema(params: {
    schemaId: string;
    schemaFetcher: () => Promise<unknown>;
  }): Promise<void> {
    const { schemaId, schemaFetcher } = params;
    if (this.#jsonSchemas[schemaId]) {
      return;
    }

    const monaco = await firstValueFrom(this.#monaco$);
    const schema = await schemaFetcher();

    this.#jsonSchemas[schemaId] = schema;

    const schemas: JSONSchemaConfig[] = Object.entries(this.#jsonSchemas).map(
      ([schemaId, schema]) => {
        return {
          uri: schemaId,
          fileMatch: [this.#getJSONSchemaURI(schemaId)],
          schema,
        };
      }
    );

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas,
    });
  }

  async getJSONModel(params: {
    schemaId: string;
    initialValue?: string;
  }): Promise<editor.ITextModel> {
    const { schemaId, initialValue = '' } = params;
    const monaco = await firstValueFrom(this.#monaco$);
    try {
      const uri = monaco.Uri.parse(this.#getJSONSchemaURI(schemaId));
      const model =
        monaco.editor.getModel(uri) ??
        monaco.editor.createModel('', 'json', monaco.Uri.parse(this.#getJSONSchemaURI(schemaId)));
      model.setValue(initialValue);
      return model;
    } catch (error) {
      console.error('Error getting JSON model: ', error);
      throw error;
    }
  }

  async createEditor(
    element: HTMLElement,
    options: IStandaloneEditorConstructionOptions
  ): Promise<MonacoEditorInstance> {
    const monaco = await firstValueFrom(this.#monaco$);

    return monaco.editor.create(element, options);
  }
}
