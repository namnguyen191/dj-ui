import {
  ComponentRef,
  computed,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  InjectionToken,
  input,
  type InputSignal,
  OutputEmitterRef,
  reflectComponentType,
  runInInjectionContext,
  type Signal,
  Type,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { parentContains } from '@namnguyen191/common-js-helper';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  from,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import type { UnknownRecord } from 'type-fest';

import type {
  BaseUIElementComponent,
  UIElementRequiredConfigs,
} from '../../components/base-ui-element.component';
import type { BaseUIElementWrapperComponent } from '../../components/base-ui-element-wrapper.component';
import {
  type ActionHook,
  ActionHookService,
} from '../../services/events-and-actions/action-hook.service';
import { InterpolationService } from '../../services/interpolation.service';
import type { RemoteResourcesStates } from '../../services/remote-resource/remote-resource.interface';
import { getRemoteResourcesStatesAsContext } from '../../services/remote-resource/remote-resource.service';
import { getStatesSubscriptionAsContext, type StateMap } from '../../services/state-store.service';
import {
  type UIElementTemplateOptions,
  UIElementTemplateService,
  type UIElementTemplateWithStatus,
} from '../../services/templates/ui-element-template.service';
import { UIElementFactoryService } from '../../services/ui-element-factory.service';
import { logSubscription, logWarning } from '../../utils/logging';

export type ElementRendererConfig = {
  uiElementLoadingComponent?: Type<unknown>;
  uiElementWrapperComponent?: Type<BaseUIElementWrapperComponent>;
  uiElementInfiniteErrorComponent?: Type<unknown>;
};
export const ELEMENT_RENDERER_CONFIG = new InjectionToken<ElementRendererConfig>(
  'ELEMENT_RENDERER_CONFIG'
);

type ElementInputsInterpolationContext = {
  remoteResourcesStates: null | RemoteResourcesStates;
  state: StateMap | null;
};

type RequiredInputStreams = {
  [K in keyof UIElementRequiredConfigs]: Observable<UIElementRequiredConfigs[K]>;
};

type InputsFromInterpolationTrackingStreams = Pick<
  RequiredInputStreams,
  'isInterpolationLoading' | 'isInterpolationError'
>;

type InputsFromRemoteResourceStreams = Pick<
  RequiredInputStreams,
  'isResourceLoading' | 'isResourceError'
>;

type UserProvidedInputsStreams = {
  [inputName: string]: Observable<unknown>;
};

type InputsStreams = RequiredInputStreams & UserProvidedInputsStreams;

type InputsWithInterpolationTrackingStreams = InputsFromInterpolationTrackingStreams &
  UserProvidedInputsStreams;

@Directive({
  selector: '[djuiUIElementRenderer]',
})
export class UIElementRendererDirective {
  readonly #uiElementFactoryService = inject(UIElementFactoryService);
  readonly #uiElementTemplatesService = inject(UIElementTemplateService);
  readonly #interpolationService = inject(InterpolationService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #actionHookService = inject(ActionHookService);
  readonly #elementRef = inject(ElementRef);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #elementRendererConfig = inject(ELEMENT_RENDERER_CONFIG, { optional: true });
  readonly #uiElementLoadingComponent = this.#elementRendererConfig?.uiElementLoadingComponent;
  readonly #uiElementInfiniteErrorComponent =
    this.#elementRendererConfig?.uiElementInfiniteErrorComponent;
  readonly #uiElementWrapperComponent = this.#elementRendererConfig?.uiElementWrapperComponent;

  readonly uiElementTemplateId: InputSignal<string> = input.required({
    alias: 'djuiUIElementRenderer',
  });
  readonly requiredComponentSymbols = input<symbol[]>([]);
  readonly configsOverride = input<UnknownRecord>({});

  readonly uiElementTemplate: Signal<UIElementTemplateWithStatus | undefined> =
    computedFromObservable(() => {
      return this.#uiElementTemplatesService.getTemplate(this.uiElementTemplateId());
    });

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
      this.#viewContainerRef.clear();
      const uiElementTemplate = this.uiElementTemplate();

      if (uiElementTemplate?.status !== 'loaded') {
        if (this.#uiElementLoadingComponent) {
          this.#viewContainerRef.createComponent(this.#uiElementLoadingComponent);
        }
        return null;
      }

      if (this.isInfinite()) {
        if (this.#uiElementInfiniteErrorComponent) {
          this.#viewContainerRef.createComponent(this.#uiElementInfiniteErrorComponent);
        }
        return null;
      }

      const uiElementComp = this.uiElementComponent();

      if (!uiElementComp) {
        return null;
      }

      const uiElementTemplateId = untracked(this.uiElementTemplateId);

      const componentSymbol: symbol = (uiElementComp as unknown as typeof BaseUIElementComponent)
        .ELEMENT_SYMBOL;
      const requiredComponentSymbols = this.requiredComponentSymbols();
      if (!this.#hasCorrectComponentSymbol(uiElementComp, requiredComponentSymbols)) {
        logWarning(
          `${uiElementTemplateId}: Wrong element received: expect ${requiredComponentSymbols.map((sym) => String(sym)).join('or ')} but got ${String(componentSymbol)}`
        );
        return null;
      }

      const uiElementWrapperComponent = this.#getUIElementWrapper(componentSymbol);
      if (uiElementWrapperComponent) {
        uiElementWrapperComponent.setInput('uiElementTemplate', uiElementTemplate.config);
        const uiElementVCR = uiElementWrapperComponent.instance.uiElementVCR();

        if (!uiElementVCR) {
          return null;
        }
        const createdUIElementComponent = uiElementVCR.createComponent(uiElementComp);
        uiElementWrapperComponent.setInput('uiElementComponentRef', createdUIElementComponent);

        return createdUIElementComponent;
      }

      return this.#viewContainerRef.createComponent(uiElementComp);
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

  readonly #componentInputsStream: Signal<InputsStreams | null> = computed(() => {
    const uiElementTemplate = this.uiElementTemplate();
    const elementInterpolationContext$ = this.#elementInterpolationContext();

    if (uiElementTemplate?.status !== 'loaded' || !elementInterpolationContext$) {
      return null;
    }

    const {
      config: { options: templateOptions, remoteResourceIds },
    } = uiElementTemplate;

    const inputsFromRemoteResource: InputsFromRemoteResourceStreams = remoteResourceIds?.length
      ? this.#generateInputsFromRemoteResource({
          elementInterpolationContext$,
        })
      : {
          isResourceLoading: of(false),
          isResourceError: of(false),
        };

    const inputsWithInterpolationTracking: InputsWithInterpolationTrackingStreams =
      this.#generateInputsWithInterpolationTracking({
        templateOptions,
        elementInterpolationContext$,
      });

    const loadingAndErrorInputs: Pick<RequiredInputStreams, 'isLoading' | 'isError'> = {
      isLoading: combineLatest({
        isResourceLoading: inputsFromRemoteResource.isResourceLoading,
        isInterpolationLoading: inputsWithInterpolationTracking.isInterpolationLoading,
      }).pipe(
        map(
          ({ isResourceLoading, isInterpolationLoading }) =>
            isResourceLoading || isInterpolationLoading
        )
      ),
      isError: combineLatest({
        isResourceError: inputsFromRemoteResource.isResourceError,
        isInterpolationError: inputsWithInterpolationTracking.isInterpolationError,
      }).pipe(
        map(({ isResourceError, isInterpolationError }) => isResourceError || isInterpolationError)
      ),
    };

    const configsOverride: UserProvidedInputsStreams = Object.entries(
      this.configsOverride()
    ).reduce(
      (accInputs, [inputName, inputVal]) => ({
        ...accInputs,
        [inputName]: of(inputVal),
      }),
      {}
    );

    const inputsStreams: InputsStreams = {
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
    ) as InputsStreams;

    return debouncedAndDistinctInputs;
  });

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
      if (this.#checkInputExistsForComponent(componentRef.componentType, inputName)) {
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
                  this.#interpolationService.interpolate({
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

  #checkInputExistsForComponent(componentClass: Type<unknown>, inputName: string): boolean {
    const componentInputs = reflectComponentType(componentClass)?.inputs;

    if (!componentInputs) {
      throw new Error('Invalid component');
    }

    return !!componentInputs.find(
      (input) => input.propName === inputName || input.templateName === inputName
    );
  }

  #generateInputsWithInterpolationTracking(params: {
    templateOptions: UIElementTemplateOptions;
    elementInterpolationContext$: Observable<ElementInputsInterpolationContext>;
  }): InputsWithInterpolationTrackingStreams {
    const { templateOptions, elementInterpolationContext$ } = params;

    const interpolationLoadingMapSubject = new BehaviorSubject<{ [inputName: string]: boolean }>(
      {}
    );
    const isInterpolationLoading$ = interpolationLoadingMapSubject
      .asObservable()
      .pipe(map((loadingMap) => !Object.values(loadingMap).every((loadingVal) => !loadingVal)));
    const interpolationErrorMapSubject = new BehaviorSubject<{ [inputName: string]: boolean }>({});
    const isInterpolationError$ = interpolationErrorMapSubject
      .asObservable()
      .pipe(map((errMap) => !Object.values(errMap).every((errVal) => !errVal)));

    const inputsFromInterpolationTracking: InputsFromInterpolationTrackingStreams = {
      isInterpolationLoading: isInterpolationLoading$,
      isInterpolationError: isInterpolationError$,
    };

    const userProvidedInputs: UserProvidedInputsStreams = {};
    for (const [key, val] of Object.entries(templateOptions)) {
      const requiredInterpolation = this.#interpolationService.checkForInterpolation(val);

      userProvidedInputs[key] = !requiredInterpolation
        ? of(val)
        : elementInterpolationContext$.pipe(
            switchMap((context) => {
              const currentLoadingMap = structuredClone(interpolationLoadingMapSubject.getValue());
              currentLoadingMap[key] = true;
              interpolationLoadingMapSubject.next(currentLoadingMap);
              return this.#interpolationService.interpolate({
                context,
                value: val,
              });
            }),
            catchError((err) => {
              const currentErrorMap = structuredClone(interpolationErrorMapSubject.getValue());
              currentErrorMap[key] = true;
              interpolationErrorMapSubject.next(currentErrorMap);
              console.warn(`Fail to interpolate ${key}. Error: ${err}`);
              return EMPTY;
            }),
            tap({
              next: () => {
                const currentErrorMap = structuredClone(interpolationErrorMapSubject.getValue());
                currentErrorMap[key] = false;
                interpolationErrorMapSubject.next(currentErrorMap);
                const currentLoadingMap = structuredClone(
                  interpolationLoadingMapSubject.getValue()
                );
                currentLoadingMap[key] = false;
                interpolationLoadingMapSubject.next(currentLoadingMap);
              },
            })
          );
    }

    // Always spread inputsFromInterpolationTracking first to allow userProvidedInputs to override it
    return {
      ...inputsFromInterpolationTracking,
      ...userProvidedInputs,
    };
  }

  #generateInputsFromRemoteResource(params: {
    elementInterpolationContext$: Observable<ElementInputsInterpolationContext>;
  }): InputsFromRemoteResourceStreams {
    const { elementInterpolationContext$ } = params;
    return {
      isResourceLoading: elementInterpolationContext$.pipe(
        map((context) => !!context.remoteResourcesStates?.isPartialLoading.length)
      ),
      isResourceError: elementInterpolationContext$.pipe(
        map((context) => !!context.remoteResourcesStates?.isPartialError.length)
      ),
    };
  }

  #hasCorrectComponentSymbol(
    uiElementComp: Type<BaseUIElementComponent>,
    requiredComponentSymbols: symbol[]
  ): boolean {
    const componentSymbol: symbol = (uiElementComp as unknown as typeof BaseUIElementComponent)
      .ELEMENT_SYMBOL;

    if (requiredComponentSymbols.length && !requiredComponentSymbols.includes(componentSymbol)) {
      return false;
    }

    return true;
  }

  #getUIElementWrapper(
    componentSymbol: symbol
  ): ComponentRef<BaseUIElementWrapperComponent> | null {
    if (!this.#uiElementWrapperComponent) {
      return null;
    }

    const excludedElements = (
      this.#uiElementWrapperComponent as unknown as typeof BaseUIElementWrapperComponent
    ).EXCLUDED_ELEMENTS;

    if (excludedElements && !excludedElements.has(componentSymbol)) {
      const uiElementWrapperComponent = this.#viewContainerRef.createComponent(
        this.#uiElementWrapperComponent
      );

      return uiElementWrapperComponent;
    }

    return null;
  }
}
