import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, type InputSignal } from '@angular/core';
import { BaseUIElementComponent, type UIElementImplementation } from '@dj-ui/core';
import { SimpleTextElementType, SimpleTextSymbol } from '@dj-ui/prime-ng-ext/shared';
import { parseZodWithDefault } from '@namnguyen191/types-helper';

import {
  type SimpleTextConfigs,
  type TextBlocksConfigOption,
  type TextStyles,
  ZTextBlocksConfigOption,
} from './simple-text.interface';

@Component({
  selector: 'dj-ui-prime-ng-simple-text',
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

  protected getTextBlockClasses(textBlockStyles: TextStyles): Record<string, boolean> {
    return {
      'align-left': textBlockStyles.align === 'left',
      'align-right': textBlockStyles.align === 'right',
      'align-center': textBlockStyles.align === 'center',
      underline: !!textBlockStyles.underline,
    };
  }

  protected getTextBlockStyles(textBlockStyles: TextStyles): Record<string, string | undefined> {
    return {
      '--font-weight': textBlockStyles.weight?.toString(),
      '--font-size': textBlockStyles.size ? textBlockStyles.size + 'px' : undefined,
      '--background-color': textBlockStyles.backgroundColor,
    };
  }
}
