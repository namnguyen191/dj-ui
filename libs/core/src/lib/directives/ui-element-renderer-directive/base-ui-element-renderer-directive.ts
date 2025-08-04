import {
  ComponentRef,
  computed,
  Directive,
  EnvironmentInjector,
  inject,
  InjectionToken,
  input,
  type InputSignal,
  reflectComponentType,
  runInInjectionContext,
  type Signal,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  first,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import type { UnknownRecord } from 'type-fest';

import type {
  BaseUIElementComponent,
  UIElementBaseConfigs,
} from '../../components/base-ui-element.component';
import type { BaseUIElementWrapperComponent } from '../../components/base-ui-element-wrapper.component';
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

export type ElementRendererConfig = {
  uiElementLoadingComponent?: Type<unknown>;
  uiElementWrapperComponent?: Type<BaseUIElementWrapperComponent>;
  uiElementInfiniteErrorComponent?: Type<unknown>;
};
export const ELEMENT_RENDERER_CONFIG = new InjectionToken<ElementRendererConfig>(
  'ELEMENT_RENDERER_CONFIG'
);

export type ElementInputsInterpolationContext = {
  remoteResourcesStates: null | RemoteResourcesStates;
  state: StateMap | null;
};

export type BaseInputStreams = {
  [K in keyof Required<UIElementBaseConfigs>]: Observable<UIElementBaseConfigs[K]>;
};

export type BaseInputFromInterpolationTrackingStreams = Pick<
  BaseInputStreams,
  'isInterpolationLoading' | 'isInterpolationError'
>;

export type BaseInputFromRemoteResourceStreams = Pick<
  BaseInputStreams,
  'isResourceLoading' | 'isResourceError'
>;

export type UserProvidedInputStreams = {
  [inputName: string]: Observable<unknown>;
};

export type InputStreams = BaseInputStreams & UserProvidedInputStreams;

export type InputWithInterpolationTrackingStreams = BaseInputFromInterpolationTrackingStreams &
  UserProvidedInputStreams;

@Directive()
export class BaseUIElementRendererDirective {
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #uiElementTemplatesService = inject(UIElementTemplateService);
  readonly #uiElementFactoryService = inject(UIElementFactoryService);

  protected readonly interpolationService = inject(InterpolationService);
  protected readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly elementRendererConfig = inject(ELEMENT_RENDERER_CONFIG, { optional: true });

  readonly #uiElementWrapperComponent = this.elementRendererConfig?.uiElementWrapperComponent;

  readonly uiElementTemplateId: InputSignal<string> = input.required({
    alias: 'djuiUIElementRenderer',
  });
  readonly requiredComponentSymbols = input<symbol[]>([]);
  readonly configsOverride = input<UnknownRecord>({});

  protected readonly uiElementTemplate: Signal<UIElementTemplateWithStatus | undefined> =
    computedFromObservable(() => {
      return this.#uiElementTemplatesService.getTemplate(this.uiElementTemplateId());
    });

  protected readonly uiElementComponent: Signal<Type<BaseUIElementComponent> | undefined> =
    computedFromObservable(() => {
      const uiElementTemp = this.uiElementTemplate();
      if (!uiElementTemp || !uiElementTemp.config) {
        return of(undefined);
      }

      return from(this.#uiElementFactoryService.getUIElement(uiElementTemp.config.type));
    });

  protected readonly elementInterpolationContext: Signal<Observable<ElementInputsInterpolationContext> | null> =
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

  protected readonly componentInputsStream: Signal<InputStreams | null> = computed(() => {
    const uiElementTemplate = this.uiElementTemplate();
    const elementInterpolationContext$ = this.elementInterpolationContext();

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

  readonly componentRequiredInputs: Signal<Record<string, unknown> | undefined> =
    computedFromObservable(() => {
      const allInputs = this.componentInputsStream();
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

  protected checkInputExistsForComponent(
    componentClass: Type<unknown>,
    inputName: string
  ): boolean {
    const componentInputs = reflectComponentType(componentClass)?.inputs;

    if (!componentInputs) {
      throw new Error('Invalid component');
    }

    return !!componentInputs.find(
      (input) => input.propName === inputName || input.templateName === inputName
    );
  }

  protected getComponentRequiredInputs(componentClass: Type<unknown>): string[] {
    const componentInputs = reflectComponentType(componentClass)?.inputs;

    if (!componentInputs) {
      throw new Error('Invalid component');
    }

    return componentInputs
      .filter((input) => input.propName.includes('RequiredConfigOption'))
      .map((input) => input.templateName);
  }

  protected generateInputsWithInterpolationTracking(params: {
    templateOptions: UIElementTemplateOptions;
    elementInterpolationContext$: Observable<ElementInputsInterpolationContext>;
  }): InputWithInterpolationTrackingStreams {
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

    const baseInputFromInterpolationTrackingStreams: BaseInputFromInterpolationTrackingStreams = {
      isInterpolationLoading: isInterpolationLoading$,
      isInterpolationError: isInterpolationError$,
    };

    const userProvidedInputStreams: UserProvidedInputStreams = {};
    for (const [key, val] of Object.entries(templateOptions)) {
      const requiredInterpolation = this.interpolationService.checkForInterpolation(val);

      userProvidedInputStreams[key] = !requiredInterpolation
        ? of(val)
        : elementInterpolationContext$.pipe(
            switchMap((context) => {
              const currentLoadingMap = structuredClone(interpolationLoadingMapSubject.getValue());
              currentLoadingMap[key] = true;
              interpolationLoadingMapSubject.next(currentLoadingMap);
              return this.interpolationService.interpolate({
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
      ...baseInputFromInterpolationTrackingStreams,
      ...userProvidedInputStreams,
    };
  }

  protected generateInputsFromRemoteResource(params: {
    elementInterpolationContext$: Observable<ElementInputsInterpolationContext>;
  }): BaseInputFromRemoteResourceStreams {
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

  protected hasCorrectComponentSymbol(
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

  protected getUIElementWrapper(
    componentSymbol: symbol
  ): ComponentRef<BaseUIElementWrapperComponent> | null {
    if (!this.#uiElementWrapperComponent) {
      return null;
    }

    const excludedElements = (
      this.#uiElementWrapperComponent as unknown as typeof BaseUIElementWrapperComponent
    ).EXCLUDED_ELEMENTS;

    if (excludedElements && !excludedElements.has(componentSymbol)) {
      const uiElementWrapperComponent = this.viewContainerRef.createComponent(
        this.#uiElementWrapperComponent
      );

      return uiElementWrapperComponent;
    }

    return null;
  }
}
