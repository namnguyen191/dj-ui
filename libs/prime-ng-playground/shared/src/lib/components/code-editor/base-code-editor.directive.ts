import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  resource,
  type Signal,
  untracked,
  viewChild,
} from '@angular/core';
import { debounce } from 'lodash-es';

import {
  type IStandaloneEditorConstructionOptions,
  type MonacoEditorInstance,
  MonacoEditorService,
} from '../../services/monaco-editor.service';

export type CodeEditorConfigs = {
  initialValue?: string;
  valueChangeDebounceTime?: number;
  readonly?: boolean;
};

@Directive()
export abstract class BaseCodeEditorDirective<T extends CodeEditorConfigs> {
  protected readonly monacoEditorService = inject(MonacoEditorService);

  readonly configs = input.required<T>();

  readonly valueChanged = output<string>();

  protected readonly editorContainerSig: Signal<ElementRef<HTMLDivElement>> =
    viewChild.required('editorContainer');

  protected editorInstanceResource = resource({
    request: () => ({
      configs: this.configs(),
    }),
    loader: ({ request }) => {
      return this.#createMonacoEditor(request.configs);
    },
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #watchEditorValueChange = effect(() => {
    const editorInstance = this.editorInstanceResource.value();

    if (!editorInstance) {
      return;
    }

    const { valueChangeDebounceTime = 500 } = untracked(this.configs);

    const onModelChange = debounce(() => {
      const newVal = editorInstance.getValue();
      this.valueChanged.emit(newVal);
    }, valueChangeDebounceTime);

    editorInstance.onDidChangeModelContent(onModelChange);
  });

  #existingEditorInstance: MonacoEditorInstance | undefined;
  // eslint-disable-next-line no-unused-private-class-members
  readonly #disposePrevEditorInstance = effect((onCleanUp) => {
    const editorInstance = this.editorInstanceResource.value();

    this.#existingEditorInstance?.dispose();
    this.#existingEditorInstance = editorInstance;

    onCleanUp(() => {
      this.#existingEditorInstance?.dispose();
    });
  });

  protected createWrapperElement(editorContainer: HTMLElement): HTMLDivElement {
    const wrapperElement = document.createElement('div');
    wrapperElement.style.width = '100%';
    wrapperElement.style.height = '100%';
    editorContainer.appendChild(wrapperElement);

    return wrapperElement;
  }

  async #createMonacoEditor(configs: CodeEditorConfigs): Promise<MonacoEditorInstance> {
    const editorContainer = untracked(this.editorContainerSig).nativeElement;
    while (editorContainer.hasChildNodes() && editorContainer.firstChild) {
      editorContainer.removeChild(editorContainer.firstChild);
    }

    const wrapperElement = this.createWrapperElement(editorContainer);

    const extraConfigs = await this.setupAndGetConfigs();
    return this.monacoEditorService.createEditor(wrapperElement, {
      theme: 'vs-dark',
      wordWrap: 'on',
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
      value: configs.initialValue ?? '',
      readOnly: !!configs.readonly,
      ...extraConfigs,
    });
  }

  protected abstract setupAndGetConfigs(): Promise<Partial<IStandaloneEditorConstructionOptions>>;
}
