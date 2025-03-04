import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import {
  CarbonCarouselCardElementType,
  CarbonCarouselCardSymbol,
  CarbonCarouselSymbol,
} from '@dj-ui/carbon-ext/shared';
import { BaseUIElementComponent, UIElementImplementation } from '@dj-ui/core';
import { UiElementWrapperComponent } from '@dj-ui/core';
import { parseZodWithDefault } from '@namnguyen191/types-helper';

import {
  CarouselCardConfigs,
  ZCarouselIdConfigOption,
  ZDescriptionConfigOption,
  ZTitleConfigOption,
} from './carbon-carousel-card.interface';

@Component({
  selector: 'dj-ui-carbon-carousel-card',
  imports: [CommonModule, UiElementWrapperComponent],
  templateUrl: './carbon-carousel-card.component.html',
  styleUrl: './carbon-carousel-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCarouselCardComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<CarouselCardConfigs>
{
  static override readonly ELEMENT_TYPE = CarbonCarouselCardElementType;
  static override readonly ELEMENT_SYMBOL = CarbonCarouselCardSymbol;

  override getElementType(): string {
    return CarbonCarouselCardComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return CarbonCarouselCardComponent.ELEMENT_SYMBOL;
  }

  readonly #defaultTitle = 'Default title';
  titleConfigOption: InputSignal<string> = input(this.#defaultTitle, {
    alias: 'title',
    transform: (val) => parseZodWithDefault(ZTitleConfigOption, val, this.#defaultTitle),
  });

  readonly #defaultDescription = 'Default description';
  descriptionConfigOption: InputSignal<string> = input(this.#defaultDescription, {
    alias: 'description',
    transform: (val) =>
      parseZodWithDefault(ZDescriptionConfigOption, val, this.#defaultDescription),
  });

  #defaultCarouselId = 'missingCarouselId';
  carouselIdConfigOption: InputSignal<string> = input(this.#defaultCarouselId, {
    alias: 'carouselId',
    transform: (val) => parseZodWithDefault(ZCarouselIdConfigOption, val, this.#defaultCarouselId),
  });

  carouselSymbol = CarbonCarouselSymbol;
}
