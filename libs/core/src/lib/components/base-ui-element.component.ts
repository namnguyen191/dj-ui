import {
  Directive,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import type { UnknownRecord } from 'type-fest';
import { z } from 'zod';

export const ZodIsLoading = z.boolean({
  error: 'loading state must be a boolean',
});

export const ZodIsError = z.boolean({
  error: 'error state must be a boolean',
});

export const ZUIElementBaseConfigs = z.strictObject({
  isInterpolationLoading: z.boolean().optional(),
  isInterpolationError: z.boolean().optional(),
  isResourceLoading: z.boolean().optional(),
  isResourceError: z.boolean().optional(),
  isLoading: z.boolean().optional(),
  isError: z.boolean().optional(),
});
export type UIElementBaseConfigs = z.infer<typeof ZUIElementBaseConfigs>;

type UIElementInputOptionKey<TInputKey extends string, TInputVal> = undefined extends TInputVal
  ? `${TInputKey}ConfigOption`
  : `${TInputKey}RequiredConfigOption`;
type UIElementInputOptionValue<TInputVal> =
  | InputSignal<Exclude<TInputVal, undefined>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | InputSignalWithTransform<Exclude<TInputVal, undefined>, any>;
type CreateUIElementInputOptions<TConfigs> = Required<{
  [K in keyof TConfigs as K extends string
    ? UIElementInputOptionKey<K, TConfigs[K]>
    : never]: UIElementInputOptionValue<TConfigs[K]>;
}>;

export type UIElementRequiredInputOptions = CreateUIElementInputOptions<UIElementBaseConfigs>;

export type UIElementRequiredInputs = {
  [K in keyof UIElementBaseConfigs as K extends string ? `${K}ConfigOption` : never]:
    | UIElementBaseConfigs[K]
    | Observable<UIElementBaseConfigs[K]>;
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

@Directive({
  host: {
    '[attr.uid]': 'uid',
  },
})
export abstract class BaseUIElementComponent
  implements UIElementImplementation<UIElementBaseConfigs>
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

  uid = crypto.randomUUID();
}
