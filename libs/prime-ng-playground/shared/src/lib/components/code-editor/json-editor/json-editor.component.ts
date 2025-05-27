import { CommonModule } from '@angular/common';
import { Component, untracked } from '@angular/core';

import type { IStandaloneEditorConstructionOptions } from '../../../services/monaco-editor.service';
import { BaseCodeEditorDirective, type CodeEditorConfigs } from '../base-code-editor.directive';

export type JSONCodeEditorConfigs = CodeEditorConfigs & {
  schemaId?: string;
};

@Component({
  selector: 'prime-ng-playground-shared-json-editor',
  imports: [CommonModule],
  templateUrl: './json-editor.component.html',
  styleUrl: './json-editor.component.scss',
})
export class JsonEditorComponent extends BaseCodeEditorDirective<JSONCodeEditorConfigs> {
  protected override async setupAndGetConfigs(): Promise<
    Partial<IStandaloneEditorConstructionOptions>
  > {
    const { schemaId, initialValue } = untracked(this.configs);
    const model = schemaId
      ? await this.monacoEditorService.getJSONModel({
          schemaId,
          initialValue,
        })
      : undefined;
    return {
      language: 'json',
      model,
    };
  }
}
