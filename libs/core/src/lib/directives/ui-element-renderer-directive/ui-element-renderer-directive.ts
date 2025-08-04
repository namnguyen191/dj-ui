import {
  ComponentRef,
  computed,
  Directive,
  effect,
  inject,
  OutputEmitterRef,
  type Signal,
  untracked,
} from '@angular/core';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import type { UnknownRecord } from 'type-fest';

import type { BaseUIElementComponent } from '../../components/base-ui-element.component';
import {
  type ActionHook,
  ActionHookService,
} from '../../services/events-and-actions/action-hook.service';
import { logSubscription, logWarning } from '../../utils/logging';
import { BaseUIElementRendererDirective } from './base-ui-element-renderer-directive';
import { InfiniteStateRendererDirective } from './infinite-state-renderer-directive';
import { LoadingStateRendererDirective } from './loading-state-renderer-directive';

@Directive({
  selector: '[djuiUIElementRenderer]',
  hostDirectives: [
    {
      directive: InfiniteStateRendererDirective,
      inputs: ['djuiUIElementRenderer'],
    },
    {
      directive: LoadingStateRendererDirective,
      inputs: ['djuiUIElementRenderer'],
    },
  ],
})
export class UIElementRendererDirective extends BaseUIElementRendererDirective {
  readonly #actionHookService = inject(ActionHookService);
  readonly #infiniteStateRendererDirective = inject(InfiniteStateRendererDirective);
  readonly #loadingStateRendererDirective = inject(LoadingStateRendererDirective);

  readonly #uiElementComponentRef: Signal<ComponentRef<BaseUIElementComponent> | null> = computed(
    () => {
      if (this.#loadingStateRendererDirective.isLoading()) {
        return null;
      }

      if (this.#infiniteStateRendererDirective.isInfinite()) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const uiElementTemplate = this.uiElementTemplate()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const uiElementComp = this.uiElementComponent()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const requiredInputs = this.componentRequiredInputs()!;

      const uiElementTemplateId = untracked(this.uiElementTemplateId);

      const componentSymbol: symbol = (uiElementComp as unknown as typeof BaseUIElementComponent)
        .ELEMENT_SYMBOL;
      const requiredComponentSymbols = this.requiredComponentSymbols();
      if (!this.hasCorrectComponentSymbol(uiElementComp, requiredComponentSymbols)) {
        logWarning(
          `${uiElementTemplateId}: Wrong element received: expect ${requiredComponentSymbols.map((sym) => String(sym)).join('or ')} but got ${String(componentSymbol)}`
        );
        return null;
      }

      this.viewContainerRef.clear();

      let componentRef: ComponentRef<BaseUIElementComponent>;

      const uiElementWrapperComponent = this.getUIElementWrapper(componentSymbol);
      if (uiElementWrapperComponent) {
        uiElementWrapperComponent.setInput('uiElementTemplate', uiElementTemplate.config);
        const uiElementVCR = uiElementWrapperComponent.instance.uiElementVCR();

        if (!uiElementVCR) {
          return null;
        }
        const createdUIElementComponent = uiElementVCR.createComponent(uiElementComp);
        uiElementWrapperComponent.setInput('uiElementComponentRef', createdUIElementComponent);

        componentRef = createdUIElementComponent;
      }

      componentRef = this.viewContainerRef.createComponent(uiElementComp);

      for (const [inputName, inputVal] of Object.entries(requiredInputs)) {
        componentRef.setInput(inputName, inputVal);
      }

      return componentRef;
    }
  );

  // eslint-disable-next-line no-unused-private-class-members
  readonly #componentSetupEffect = effect((onCleanup) => {
    const componentInputsStream = this.componentInputsStream();
    const componentRef = this.#uiElementComponentRef();
    const uiElementTemplate = this.uiElementTemplate();
    const elementInterpolationContext = this.elementInterpolationContext();

    if (
      !componentInputsStream ||
      !componentRef ||
      uiElementTemplate?.status !== 'loaded' ||
      !elementInterpolationContext
    ) {
      return;
    }

    // setup id to prevent infinite loading
    (componentRef.location.nativeElement as HTMLElement).setAttribute(
      'elementTemplateId',
      untracked(this.uiElementTemplateId)
    );

    const unsubscribeInputsSubject = new Subject<void>();
    onCleanup(() => {
      unsubscribeInputsSubject.next();
      unsubscribeInputsSubject.complete();
    });

    for (const [inputName, valStream] of Object.entries(componentInputsStream)) {
      if (this.checkInputExistsForComponent(componentRef.componentType, inputName)) {
        valStream.pipe(takeUntil(unsubscribeInputsSubject)).subscribe((val) => {
          logSubscription(`[${this.uiElementTemplateId()}] Input stream for ${inputName}`);
          componentRef.setInput(inputName, val);
        });
      } else {
        logWarning(
          `Input ${inputName} does not exist for component ${componentRef.instance.getElementType()}`
        );
      }
    }

    const { eventsHooks } = uiElementTemplate.config;
    if (eventsHooks) {
      for (const [eventName, hooks] of Object.entries(eventsHooks)) {
        const componentOutput = (componentRef.instance as unknown as UnknownRecord)[eventName] as
          | undefined
          | OutputEmitterRef<unknown>;

        if (!componentOutput || !(componentOutput instanceof OutputEmitterRef)) {
          logWarning(
            `Element ${componentRef.instance.getElementType()} has no support for event "${eventName}"`
          );
        } else {
          const latestContext = elementInterpolationContext.pipe(take(1));

          componentOutput.subscribe((outputVal) => {
            latestContext
              .pipe(
                switchMap((latestContextVal) =>
                  this.interpolationService.interpolate({
                    value: hooks,
                    context: { ...latestContextVal, $eventOutput: outputVal },
                  })
                )
              )
              .subscribe((interpolatedHooks) => {
                logSubscription(`Output stream for ${this.uiElementTemplateId()}`);
                this.#actionHookService.triggerActionHooks(interpolatedHooks as ActionHook[]);
              });
          });
        }
      }
    }
  });
}
