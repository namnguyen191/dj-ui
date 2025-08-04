import { computed, Directive, effect, ElementRef, inject, type Signal } from '@angular/core';
import { parentContains } from '@namnguyen191/common-js-helper';

import {
  BaseUIElementRendererDirective,
  ELEMENT_RENDERER_CONFIG,
} from './base-ui-element-renderer-directive';

@Directive()
export class InfiniteStateRendererDirective extends BaseUIElementRendererDirective {
  readonly #elementRef = inject(ElementRef);
  readonly #elementRendererConfig = inject(ELEMENT_RENDERER_CONFIG, { optional: true });

  readonly #uiElementInfiniteErrorComponent =
    this.#elementRendererConfig?.uiElementInfiniteErrorComponent;

  readonly isInfinite: Signal<boolean> = computed(() => {
    const uiElementTemplateId = this.uiElementTemplateId();
    const curEle = this.#elementRef.nativeElement as HTMLElement;

    const { contains: isInfinite, chain } = parentContains({
      ele: curEle,
      attrName: 'elementTemplateId',
      attrValue: uiElementTemplateId,
    });

    if (isInfinite) {
      const elementChain = [...chain, uiElementTemplateId].join(' -> ');
      console.error(
        `UI element with id ${uiElementTemplateId} has already existed in parents. Check ${elementChain}`
      );
    }

    return isInfinite;
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #renderInfiniteStateEffect = effect(() => {
    if (this.isInfinite()) {
      if (this.#uiElementInfiniteErrorComponent) {
        this.viewContainerRef.createComponent(this.#uiElementInfiniteErrorComponent);
      }
    }
  });
}
