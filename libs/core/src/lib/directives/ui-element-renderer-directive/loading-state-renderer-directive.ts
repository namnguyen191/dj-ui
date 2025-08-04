import { computed, Directive, effect, inject, type Signal } from '@angular/core';

import {
  BaseUIElementRendererDirective,
  ELEMENT_RENDERER_CONFIG,
} from './base-ui-element-renderer-directive';

@Directive()
export class LoadingStateRendererDirective extends BaseUIElementRendererDirective {
  readonly #elementRendererConfig = inject(ELEMENT_RENDERER_CONFIG, { optional: true });

  readonly #uiElementLoadingComponent = this.#elementRendererConfig?.uiElementLoadingComponent;

  readonly isLoading: Signal<boolean> = computed(() => {
    const uiElementTemplate = this.uiElementTemplate();
    if (uiElementTemplate?.status !== 'loaded') {
      return true;
    }

    return false;
  });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #renderLoadingStateEffect = effect(() => {
    if (this.isLoading()) {
      this.viewContainerRef.clear();
      if (this.#uiElementLoadingComponent) {
        this.viewContainerRef.createComponent(this.#uiElementLoadingComponent);
      }
    }
  });
}
