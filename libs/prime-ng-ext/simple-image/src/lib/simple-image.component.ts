import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, type InputSignal } from '@angular/core';
import { parseZodWithDefault } from '@dj-ui/common/shared';
import { BaseUIElementComponent, type UIElementImplementation } from '@dj-ui/core';
import {
  type AltLabelConfigOption,
  type ImageUrlConfigOption,
  type PriorityConfigOption,
  type SimpleImageConfigs,
  SimpleImageElementType,
  SimpleImageSymbol,
  ZAltLabelConfigOption,
  ZImageUrlConfigOption,
  ZPriorityConfigOption,
} from '@dj-ui/prime-ng-ext/shared';

@Component({
  selector: 'dj-ui-prime-ng-simple-image',
  imports: [NgOptimizedImage],
  templateUrl: './simple-image.component.html',
  styleUrl: './simple-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleImageComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<SimpleImageConfigs>
{
  static override readonly ELEMENT_TYPE = SimpleImageElementType;
  static override readonly ELEMENT_SYMBOL = SimpleImageSymbol;

  override getElementType(): string {
    return SimpleImageComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return SimpleImageComponent.ELEMENT_SYMBOL;
  }

  imageUrlConfigOption: InputSignal<ImageUrlConfigOption> = input('', {
    alias: 'imageUrl',
    transform: (val) => parseZodWithDefault<ImageUrlConfigOption>(ZImageUrlConfigOption, val, ''),
  });

  #defaultAltLabel = 'image';
  altLabelConfigOption: InputSignal<AltLabelConfigOption> = input(this.#defaultAltLabel, {
    alias: 'altLabel',
    transform: (val) =>
      parseZodWithDefault<AltLabelConfigOption>(ZAltLabelConfigOption, val, this.#defaultAltLabel),
  });

  #defaultPriority = false;
  priorityConfigOption: InputSignal<PriorityConfigOption> = input(this.#defaultPriority, {
    alias: 'priority',
    transform: (val) =>
      parseZodWithDefault<PriorityConfigOption>(ZPriorityConfigOption, val, this.#defaultPriority),
  });
}
