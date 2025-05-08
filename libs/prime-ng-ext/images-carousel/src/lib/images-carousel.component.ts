import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type OnDestroy,
  type Signal,
  signal,
  viewChildren,
} from '@angular/core';
import {
  BaseUIElementComponent,
  logWarning,
  type UIElementImplementation,
  UIElementRendererDirective,
  UIElementTemplateService,
} from '@dj-ui/core';
import {
  type ImageItem,
  type ImagesCarouselConfigs,
  ImagesCarouselElementType,
  ImagesCarouselSymbol,
  type ImagesConfigOption,
  type ImageTemplateId,
  SimpleImageElementType,
  SimpleImageSymbol,
  type SimpleImageUIESchema,
  ZImagesConfigOption,
} from '@dj-ui/prime-ng-ext/shared';
import { parseZodWithDefault } from '@namnguyen191/types-helper';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'dj-ui-prime-ng-images-carousel',
  imports: [CommonModule, UIElementRendererDirective, Dialog],
  templateUrl: './images-carousel.component.html',
  styleUrl: './images-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesCarouselComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<ImagesCarouselConfigs>, OnDestroy
{
  static override readonly ELEMENT_TYPE = ImagesCarouselElementType;
  static override readonly ELEMENT_SYMBOL = ImagesCarouselSymbol;

  override getElementType(): string {
    return ImagesCarouselComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return ImagesCarouselComponent.ELEMENT_SYMBOL;
  }

  SimpleImageSymbol = SimpleImageSymbol;

  #uiElementTemplateService = inject(UIElementTemplateService);

  readonly imagesConfigOption: InputSignal<ImagesConfigOption> = input([] as ImagesConfigOption, {
    alias: 'images',
    transform: (val) => parseZodWithDefault<ImagesConfigOption>(ZImagesConfigOption, val, []),
  });

  protected readonly imageTemplateIdsSig = computed<string[]>(() => {
    const imagesConfigOption = this.imagesConfigOption();

    return this.#processImagesConfigOption(imagesConfigOption);
  });

  private readonly _carouselSlides: Signal<readonly ElementRef<HTMLLIElement>[]> = viewChildren(
    'carouselSlide',
    {
      read: ElementRef,
    }
  );

  protected readonly currentPreviewImageSig = signal<string | null>(null);

  ngOnDestroy(): void {
    for (const templateId of this.#embeddedTemplateIds) {
      this.#uiElementTemplateService.deleteTemplate(templateId);
    }
  }

  #isImageTemplateId(imageItem: ImageItem): imageItem is ImageTemplateId {
    return typeof imageItem === 'string';
  }

  #embeddedTemplateIds: string[] = [];
  #processImagesConfigOption(imagesConfigOption: ImagesConfigOption): string[] {
    return imagesConfigOption.map((item) => {
      if (this.#isImageTemplateId(item)) {
        return item;
      }

      const embeddedTemplateId = crypto.randomUUID();

      this.#uiElementTemplateService.updateOrRegisterTemplate<SimpleImageUIESchema>({
        id: embeddedTemplateId,
        type: SimpleImageElementType,
        options: item,
      });
      this.#embeddedTemplateIds.push(embeddedTemplateId);
      return embeddedTemplateId;
    });
  }

  protected setImageToPreview(imageUrl: string): void {
    this.currentPreviewImageSig.set(imageUrl);
  }

  protected closeCurrentPreviewImage(): void {
    this.currentPreviewImageSig.set(null);
  }

  protected changeToSlide(id: string): void {
    const slideElement = this._carouselSlides().find(
      (ele) => ele.nativeElement.id === id
    )?.nativeElement;
    if (!slideElement) {
      logWarning(`Slide with id ${id} does not exist. This shouldn't have happened.`);
      return;
    }

    slideElement.scrollIntoView();
  }
}
