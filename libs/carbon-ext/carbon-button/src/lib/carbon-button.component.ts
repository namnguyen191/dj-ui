import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type InputSignal,
  output,
  untracked,
} from '@angular/core';
import { CarbonButtonElementType, CarbonButtonSymbol } from '@dj-ui/carbon-ext/shared';
import { FileService } from '@dj-ui/common';
import { BaseUIElementComponent, type UIElementImplementation } from '@dj-ui/core';
import { parseZodWithDefault } from '@namnguyen191/types-helper';
import { ButtonModule, InlineLoadingModule } from 'carbon-components-angular';

import {
  type ButtonFilesSelectorConfig,
  type ButtonTypeConfig,
  type CarbonButtonUIElementComponentConfigs,
  type CarbonButtonUIElementComponentEvents,
  ZodCarbonButtonUIElementComponentConfigs,
} from './carbon-button.interface';

@Component({
  selector: 'dj-ui-carbon-button',
  imports: [CommonModule, ButtonModule, InlineLoadingModule],
  templateUrl: './carbon-button.component.html',
  styleUrl: './carbon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonButtonComponent
  extends BaseUIElementComponent
  implements
    UIElementImplementation<
      CarbonButtonUIElementComponentConfigs,
      CarbonButtonUIElementComponentEvents
    >
{
  static override readonly ELEMENT_TYPE = CarbonButtonElementType;
  static override readonly ELEMENT_SYMBOL = CarbonButtonSymbol;

  override getElementType(): string {
    return CarbonButtonComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return CarbonButtonComponent.ELEMENT_SYMBOL;
  }

  #fileService = inject(FileService);

  defaultText = 'Default text';
  textConfigOption: InputSignal<string> = input(this.defaultText, {
    alias: 'text',
    transform: (val) =>
      parseZodWithDefault(
        ZodCarbonButtonUIElementComponentConfigs.shape.text,
        val,
        this.defaultText
      ),
  });

  defaultButtonType: ButtonTypeConfig = 'primary';
  typeConfigOption: InputSignal<ButtonTypeConfig> = input(this.defaultButtonType, {
    alias: 'type',
    transform: (val) =>
      parseZodWithDefault(
        ZodCarbonButtonUIElementComponentConfigs.shape.type,
        val,
        this.defaultButtonType
      ),
  });

  defaultFilesSelectorConfigOption: ButtonFilesSelectorConfig = {
    enabled: false,
  };
  filesSelectorConfigOption: InputSignal<ButtonFilesSelectorConfig> = input(
    this.defaultFilesSelectorConfigOption,
    {
      alias: 'filesSelector',
      transform: (val) =>
        parseZodWithDefault(
          ZodCarbonButtonUIElementComponentConfigs.shape.filesSelector,
          val,
          this.defaultFilesSelectorConfigOption
        ),
    }
  );

  buttonClicked = output<void>();
  filesSelected = output<{ files: FileList }>();

  onClick(): void {
    this.buttonClicked.emit();

    this.#handleFileSelection();
  }

  async #handleFileSelection(): Promise<void> {
    const filesSelectorConfig = untracked(this.filesSelectorConfigOption);
    const { single, acceptedExtensions, enabled } = filesSelectorConfig;

    if (!enabled) {
      return;
    }

    const selectedFiles = await this.#fileService.selectFiles({
      single,
      extensions: acceptedExtensions,
    });

    if (!selectedFiles) {
      return;
    }

    this.filesSelected.emit({ files: selectedFiles });
  }
}
