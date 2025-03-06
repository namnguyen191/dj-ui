import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { BaseUIElementComponent, UIElementImplementation } from '@dj-ui/core';
import { SimpleTextElementType, SimpleTextSymbol } from '@dj-ui/prime-ng-ext/shared';
import { parseZodWithDefault } from '@namnguyen191/types-helper';

import {
  SimpleTextConfigs,
  TextBlocksConfigOption,
  ZTextBlocksConfigOption,
} from './simple-text.interface';

@Component({
  selector: 'dj-ui-prime-ng-carbon-button',
  imports: [CommonModule],
  templateUrl: './simple-text.component.html',
  styleUrl: './simple-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTextComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<SimpleTextConfigs>
{
  static override readonly ELEMENT_TYPE = SimpleTextElementType;
  static override readonly ELEMENT_SYMBOL = SimpleTextSymbol;

  override getElementType(): string {
    return SimpleTextComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return SimpleTextComponent.ELEMENT_SYMBOL;
  }

  textBlocksConfigOption: InputSignal<TextBlocksConfigOption> = input(
    [] as TextBlocksConfigOption,
    {
      alias: 'textBlocks',
      transform: (val) =>
        parseZodWithDefault<TextBlocksConfigOption>(ZTextBlocksConfigOption, val, []),
    }
  );
}
