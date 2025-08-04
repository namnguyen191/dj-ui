import { computed, Directive, effect, type Signal } from '@angular/core';

import { BaseUIElementRendererDirective } from './base-ui-element-renderer-directive';

@Directive()
export class LoadingStateRendererDirective extends BaseUIElementRendererDirective {
  readonly #uiElementLoadingComponent = this.elementRendererConfig?.uiElementLoadingComponent;

  readonly isLoading: Signal<boolean> = computed(() => {
    const uiElementTemplate = this.uiElementTemplate();
    const uiElementComp = this.uiElementComponent();
    const requiredInputs = this.componentRequiredInputs();

    if (uiElementTemplate?.status !== 'loaded' || !uiElementComp || !requiredInputs) {
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
