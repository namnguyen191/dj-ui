import { ChangeDetectionStrategy, Component, input, type InputSignal } from '@angular/core';
import { CarbonSimpleTextElementType, CarbonSimpleTextSymbol } from '@dj-ui/carbon-ext/shared';
import { parseZodWithDefault } from '@dj-ui/common/shared';
import { BaseUIElementComponent, type UIElementImplementation } from '@dj-ui/core';

import {
  type SimpleTextConfigs,
  type TextBlocksConfigOption,
  ZTextBlocksConfigOption,
} from './carbon-simple-text.interface';

@Component({
  selector: 'dj-ui-carbon-simple-text',
  imports: [],
  templateUrl: './carbon-simple-text.component.html',
  styleUrl: './carbon-simple-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonSimpleTextComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<SimpleTextConfigs>
{
  static override readonly ELEMENT_TYPE = CarbonSimpleTextElementType;
  static override readonly ELEMENT_SYMBOL = CarbonSimpleTextSymbol;

  override getElementType(): string {
    return CarbonSimpleTextComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return CarbonSimpleTextComponent.ELEMENT_SYMBOL;
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
