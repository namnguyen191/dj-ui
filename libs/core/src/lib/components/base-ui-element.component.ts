import {
  Directive,
  input,
  InputSignal,
  InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { UnknownRecord } from 'type-fest';
import { z } from 'zod';

export const ZodIsLoading = z.boolean({
  invalid_type_error: 'loading state must be a boolean',
});

export const ZodIsError = z.boolean({
  invalid_type_error: 'error state must be a boolean',
});

export type UIElementRequiredConfigs = {
  isInterpolationLoading: boolean;
  isInterpolationError: boolean;
  isResourceLoading: boolean;
  isResourceError: boolean;
  isLoading: boolean;
  isError: boolean;
};

type CreateUIElementInputOptions<TConfigs> = Required<{
  [K in keyof TConfigs as K extends string ? `${K}ConfigOption` : never]:
    | InputSignal<TConfigs[K]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | InputSignalWithTransform<any, TConfigs[K]>;
}>;

export type UIElementRequiredInputOptions = CreateUIElementInputOptions<UIElementRequiredConfigs>;

export type UIElementRequiredInputs = {
  [K in keyof UIElementRequiredConfigs as K extends string ? `${K}ConfigOption` : never]:
    | UIElementRequiredConfigs[K]
    | Observable<UIElementRequiredConfigs[K]>;
};

type CreateUIElementEventsOutputs<TEvents extends UnknownRecord> = Required<{
  [K in keyof TEvents]: OutputEmitterRef<TEvents[K]>;
}>;

export type UIElementImplementation<
  TConfigs extends UnknownRecord,
  TEvents extends UnknownRecord = NonNullable<unknown>,
> = UIElementRequiredInputOptions &
  CreateUIElementInputOptions<TConfigs> &
  CreateUIElementEventsOutputs<TEvents>;

const defaultElementSymbol = Symbol('Default element');

@Directive()
export abstract class BaseUIElementComponent
  implements UIElementImplementation<UIElementRequiredConfigs>
{
  static readonly ELEMENT_TYPE: string = 'DEFAULT_ABSTRACT_COMPONENT';
  static readonly ELEMENT_SYMBOL: symbol = defaultElementSymbol;

  getElementType(): string {
    return 'DEFAULT TYPE';
  }

  getSymbol(): symbol {
    return defaultElementSymbol;
  }

  isErrorConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isError',
    transform: (val) => ZodIsError.parse(val),
  });

  isLoadingConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isLoading',
    transform: (val) => ZodIsLoading.parse(val),
  });

  isResourceLoadingConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isResourceLoading',
    transform: (val) => ZodIsError.parse(val),
  });

  isResourceErrorConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isResourceError',
    transform: (val) => ZodIsLoading.parse(val),
  });

  isInterpolationLoadingConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isInterpolationLoading',
    transform: (val) => ZodIsError.parse(val),
  });

  isInterpolationErrorConfigOption: InputSignal<boolean> = input(false, {
    alias: 'isInterpolationError',
    transform: (val) => ZodIsLoading.parse(val),
  });
}
