import {
  ComponentRef,
  Directive,
  inject,
  InjectionToken,
  input,
  type InputSignal,
  reflectComponentType,
  type Signal,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';

import type {
  BaseUIElementComponent,
  UIElementBaseConfigs,
} from '../../components/base-ui-element.component';
import type { BaseUIElementWrapperComponent } from '../../components/base-ui-element-wrapper.component';
import { InterpolationService } from '../../services/interpolation.service';
import type { RemoteResourcesStates } from '../../services/remote-resource/remote-resource.interface';
import { type StateMap } from '../../services/state-store.service';
import {
  type UIElementTemplateOptions,
  UIElementTemplateService,
  type UIElementTemplateWithStatus,
} from '../../services/templates/ui-element-template.service';

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
  readonly #elementRendererConfig = inject(ELEMENT_RENDERER_CONFIG, { optional: true });
  readonly #uiElementWrapperComponent = this.#elementRendererConfig?.uiElementWrapperComponent;
  readonly #uiElementTemplatesService = inject(UIElementTemplateService);

  protected readonly interpolationService = inject(InterpolationService);
  protected readonly viewContainerRef = inject(ViewContainerRef);

  readonly uiElementTemplateId: InputSignal<string> = input.required({
    alias: 'djuiUIElementRenderer',
  });

  protected readonly uiElementTemplate: Signal<UIElementTemplateWithStatus | undefined> =
    computedFromObservable(() => {
      return this.#uiElementTemplatesService.getTemplate(this.uiElementTemplateId());
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
