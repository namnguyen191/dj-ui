import { CommonModule } from '@angular/common';
import {
  Component,
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
  type MonacoEditorInstance,
  MonacoEditorService,
} from '../../services/monaco-editor.service';

export type CodeEditorConfigs = {
  language: 'typescript' | 'javascript' | 'json' | 'text';
  initialValue?: string;
  valueChangeDebounceTime?: number;
};

@Component({
  selector: 'app-code-editor',
  imports: [CommonModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss',
})
export class CodeEditorComponent {
  readonly #monacoEditorService = inject(MonacoEditorService);

  readonly configs = input.required<CodeEditorConfigs>();

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

  #createMonacoEditor(configs: CodeEditorConfigs): Promise<MonacoEditorInstance> {
    const editorContainer = untracked(this.editorContainerSig).nativeElement;
    while (editorContainer.hasChildNodes() && editorContainer.firstChild) {
      editorContainer.removeChild(editorContainer.firstChild);
    }

    const wrapperElement = document.createElement('div');
    wrapperElement.style.width = '100%';
    wrapperElement.style.height = '100%';
    editorContainer.appendChild(wrapperElement);

    return this.#monacoEditorService.createEditor(wrapperElement, {
      language: configs.language,
      value: configs.initialValue ?? '',
      theme: 'vs-dark',
      wordWrap: 'on',
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
    });
  }
}
