import {
  ComponentRef,
  computed,
  Directive,
  effect,
  EnvironmentInjector,
  inject,
  input,
  OutputEmitterRef,
  runInInjectionContext,
  type Signal,
  Type,
  untracked,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { isEqual } from 'lodash-es';
import {
  combineLatest,
  distinctUntilChanged,
  first,
  from,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  throttleTime,
} from 'rxjs';
import type { UnknownRecord } from 'type-fest';

import type { BaseUIElementComponent } from '../../components/base-ui-element.component';
import {
  type ActionHook,
  ActionHookService,
} from '../../services/events-and-actions/action-hook.service';
import { getRemoteResourcesStatesAsContext } from '../../services/remote-resource/remote-resource.service';
import { getStatesSubscriptionAsContext } from '../../services/state-store.service';
import { UIElementFactoryService } from '../../services/ui-element-factory.service';
import { logSubscription, logWarning } from '../../utils/logging';
import {
  type BaseInputFromInterpolationTrackingStreams,
  type BaseInputFromRemoteResourceStreams,
  type BaseInputStreams,
  BaseUIElementRendererDirective,
  type ElementInputsInterpolationContext,
  type InputStreams,
  type UserProvidedInputStreams,
} from './base-ui-element-renderer-directive';
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
  readonly #uiElementFactoryService = inject(UIElementFactoryService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #actionHookService = inject(ActionHookService);
  readonly #infiniteStateRendererDirective = inject(InfiniteStateRendererDirective);
  readonly #loadingStateRendererDirective = inject(LoadingStateRendererDirective);

  readonly requiredComponentSymbols = input<symbol[]>([]);
  readonly configsOverride = input<UnknownRecord>({});

  readonly uiElementComponent: Signal<Type<BaseUIElementComponent> | undefined> =
    computedFromObservable(() => {
      const uiElementTemp = this.uiElementTemplate();
      if (!uiElementTemp || !uiElementTemp.config) {
        return of(undefined);
      }

      return from(this.#uiElementFactoryService.getUIElement(uiElementTemp.config.type));
    });

  readonly #uiElementComponentRef: Signal<ComponentRef<BaseUIElementComponent> | null> = computed(
    () => {
      this.viewContainerRef.clear();

      if (this.#loadingStateRendererDirective.isLoading()) {
        return null;
      }

      if (this.#infiniteStateRendererDirective.isInfinite()) {
        return null;
      }

      const uiElementTemplate = this.uiElementTemplate();
      const uiElementComp = this.uiElementComponent();
      const requiredInputs = this.#componentRequiredInputs();

      if (!uiElementTemplate || !uiElementComp || !requiredInputs) {
        return null;
      }

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

  readonly #elementInterpolationContext: Signal<Observable<ElementInputsInterpolationContext> | null> =
    computed(() => {
      const uiElementTemplate = this.uiElementTemplate();

      if (!uiElementTemplate || !(uiElementTemplate.status === 'loaded')) {
        return null;
      }

      const { remoteResourceIds, stateSubscription } = uiElementTemplate.config;

      const state = stateSubscription
        ? runInInjectionContext(this.#environmentInjector, () =>
            getStatesSubscriptionAsContext(stateSubscription, `UI Element ${uiElementTemplate.id}`)
          )
        : of(null);
      const remoteResourcesStates = remoteResourceIds?.length
        ? runInInjectionContext(this.#environmentInjector, () =>
            getRemoteResourcesStatesAsContext(remoteResourceIds)
          )
        : of(null);

      return combineLatest({
        remoteResourcesStates,
        state,
      }).pipe(
        shareReplay({
          refCount: true,
          bufferSize: 1,
        })
      );
    });

  readonly #componentInputsStream: Signal<InputStreams | null> = computed(() => {
    const uiElementTemplate = this.uiElementTemplate();
    const elementInterpolationContext$ = this.#elementInterpolationContext();

    if (uiElementTemplate?.status !== 'loaded' || !elementInterpolationContext$) {
      return null;
    }

    const {
      config: { options: templateOptions, remoteResourceIds },
    } = uiElementTemplate;

    const inputsFromRemoteResource: BaseInputFromRemoteResourceStreams = remoteResourceIds?.length
      ? this.generateInputsFromRemoteResource({
          elementInterpolationContext$,
        })
      : {
          isResourceLoading: of(false),
          isResourceError: of(false),
        };

    const inputsWithInterpolationTracking: BaseInputFromInterpolationTrackingStreams =
      this.generateInputsWithInterpolationTracking({
        templateOptions,
        elementInterpolationContext$,
      });

    const loadingAndErrorInputs: Pick<BaseInputStreams, 'isLoading' | 'isError'> = {
      isLoading: combineLatest({
        isResourceLoading: inputsFromRemoteResource.isResourceLoading,
        isInterpolationLoading: inputsWithInterpolationTracking.isInterpolationLoading,
      }).pipe(
        map(
          ({ isResourceLoading, isInterpolationLoading }) =>
            !!isResourceLoading || !!isInterpolationLoading
        )
      ),
      isError: combineLatest({
        isResourceError: inputsFromRemoteResource.isResourceError,
        isInterpolationError: inputsWithInterpolationTracking.isInterpolationError,
      }).pipe(
        map(
          ({ isResourceError, isInterpolationError }) => !!isResourceError || !!isInterpolationError
        )
      ),
    };

    const configsOverride: UserProvidedInputStreams = Object.entries(this.configsOverride()).reduce(
      (accInputs, [inputName, inputVal]) => ({
        ...accInputs,
        [inputName]: of(inputVal),
      }),
      {}
    );

    const inputsStreams: InputStreams = {
      ...inputsFromRemoteResource,
      ...loadingAndErrorInputs,
      ...inputsWithInterpolationTracking,
      ...configsOverride,
    };

    const debouncedAndDistinctInputs = Object.fromEntries(
      Object.entries(inputsStreams).map(([inputName, valObs]) => [
        inputName,
        valObs.pipe(
          distinctUntilChanged(isEqual),
          throttleTime(500, undefined, { leading: true, trailing: true })
        ),
      ])
    ) as InputStreams;

    return debouncedAndDistinctInputs;
  });

  readonly #componentRequiredInputs: Signal<Record<string, unknown> | undefined> =
    computedFromObservable(() => {
      const allInputs = this.#componentInputsStream();
      const component = this.uiElementComponent();

      if (!allInputs || !component) {
        return of(undefined);
      }

      const requiredInputNames = this.getComponentRequiredInputs(component);
      const streams: Partial<InputStreams> = {};
      for (const requiredInputName of requiredInputNames) {
        streams[requiredInputName] = allInputs[requiredInputName];
      }

      if (Object.keys(streams).length === 0) {
        return of({});
      }

      return combineLatest(streams as Record<string, Observable<unknown>>).pipe(
        first()
      ) as Observable<Record<string, unknown>>;
    });

  // eslint-disable-next-line no-unused-private-class-members
  readonly #componentSetupEffect = effect((onCleanup) => {
    const componentInputsStream = this.#componentInputsStream();
    const componentRef = this.#uiElementComponentRef();
    const uiElementTemplate = this.uiElementTemplate();
    const elementInterpolationContext = this.#elementInterpolationContext();

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
