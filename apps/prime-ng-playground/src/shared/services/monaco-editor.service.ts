import { Injectable, signal, type WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import loader from '@monaco-editor/loader';
import type { editor } from 'monaco-editor';
import { filter, firstValueFrom, Observable } from 'rxjs';

export type MonacoAPI =
  typeof import('/Users/namnguyen/Desktop/projects/dj-ui/node_modules/.pnpm/monaco-editor@0.52.2/node_modules/monaco-editor/esm/vs/editor/editor.api');

export type MonacoEditorAPI = typeof editor;

export type IStandaloneEditorConstructionOptions = NonNullable<
  Parameters<MonacoEditorAPI['create']>[1]
>;

export type MonacoEditorInstance = ReturnType<MonacoEditorAPI['create']>;

@Injectable({
  providedIn: 'root',
})
export class MonacoEditorService {
  readonly #monacoSig: WritableSignal<MonacoAPI | null> = signal(null);
  readonly #monaco$: Observable<MonacoAPI> = toObservable(this.#monacoSig).pipe(
    filter((val) => val !== null)
  );

  init(): void {
    loader.init().then((monaco) => {
      this.#monacoSig.set(monaco);
    });
  }

  async createEditor(
    element: HTMLElement,
    options: IStandaloneEditorConstructionOptions
  ): Promise<MonacoEditorInstance> {
    const monaco = await firstValueFrom(this.#monaco$);

    return monaco.editor.create(element, options);
  }
}
