import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  type InputSignal,
} from '@angular/core';
import { parseZodWithDefault } from '@dj-ui/common/shared';
import {
  BaseUIElementComponent,
  type UIElementImplementation,
  UIElementRendererDirective,
  UIElementTemplateService,
} from '@dj-ui/core';
import {
  type BodyConfigOption,
  type CardConfigs,
  CardElementType,
  CardSymbol,
  ImagesCarouselSymbol,
  SimpleImageSymbol,
  type SubTitleConfigOption,
  type TitleConfigOption,
  type TopBannerConfigOption,
  ZBodyConfigOption,
  ZSubTitleConfigOption,
  ZTitleConfigOption,
  ZTopBannerConfigOption,
} from '@dj-ui/prime-ng-ext/shared';
import { Card } from 'primeng/card';

@Component({
  selector: 'dj-ui-prime-ng-card',
  imports: [Card, UIElementRendererDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<CardConfigs>
{
  static override readonly ELEMENT_SYMBOL = CardSymbol;
  static override readonly ELEMENT_TYPE = CardElementType;
  override getElementType(): string {
    return CardComponent.ELEMENT_TYPE;
  }
  override getSymbol(): symbol {
    return CardComponent.ELEMENT_SYMBOL;
  }

  readonly #uiElementTemplateService = inject(UIElementTemplateService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly defaultTopBannerConfigOption = {
    templateId: 'NO_BANNER',
  } as const satisfies TopBannerConfigOption;
  readonly topBannerConfigOption: InputSignal<TopBannerConfigOption> = input(
    this.defaultTopBannerConfigOption,
    {
      alias: 'topBanner',
      transform: (val) =>
        parseZodWithDefault<TopBannerConfigOption>(
          ZTopBannerConfigOption,
          val,
          this.defaultTopBannerConfigOption
        ),
    }
  );
  protected readonly topBannerSupportedElements = [SimpleImageSymbol, ImagesCarouselSymbol];
  protected readonly topBannerTemplateId = computed<string>(() => {
    const topBannerConfig = this.topBannerConfigOption();

    if ('templateId' in topBannerConfig) {
      return topBannerConfig.templateId;
    }

    const tempId = crypto.randomUUID();
    this.#uiElementTemplateService.updateOrRegisterTemporaryTemplate({
      template: {
        id: tempId,
        type: topBannerConfig.type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        options: topBannerConfig.configs as any,
      },
      destroyRef: this.#destroyRef,
    });
    return tempId;
  });

  readonly titleConfigOption: InputSignal<TitleConfigOption> = input('', {
    alias: 'title',
    transform: (val) => parseZodWithDefault<TitleConfigOption>(ZTitleConfigOption, val, ''),
  });

  readonly subTitleConfigOption: InputSignal<SubTitleConfigOption> = input('', {
    alias: 'subTitle',
    transform: (val) => parseZodWithDefault<SubTitleConfigOption>(ZSubTitleConfigOption, val, ''),
  });

  readonly bodyConfigOption: InputSignal<BodyConfigOption> = input('', {
    alias: 'body',
    transform: (val) => parseZodWithDefault<BodyConfigOption>(ZBodyConfigOption, val, ''),
  });
}
