import {
  Directive,
  ElementRef,
  inject,
  type InputSignal,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import type { LitElement } from 'lit';

export type UnknownCustomElement = HTMLElement & Record<string, unknown>;

export type WCProperties<T extends LitElement> = Omit<
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    [K in keyof T as T[K] extends Function ? never : K extends `_${string}` ? never : K]: T[K];
  },
  keyof LitElement
>;

export type CDSDirectiveImpl<TWC extends LitElement, TProp = WCProperties<TWC>> = {
  [K in keyof TProp]: InputSignal<
    | (Exclude<TProp[K], undefined> extends string ? `${Exclude<TProp[K], undefined>}` : TProp[K])
    | undefined
  >;
};

@Directive()
export abstract class CDSBaseDirective<T extends HTMLElement = UnknownCustomElement>
  implements OnChanges
{
  protected elementRef = inject<ElementRef<T>>(ElementRef).nativeElement;

  ngOnChanges(changes: SimpleChanges): void {
    for (const [inputName, change] of Object.entries(changes)) {
      const inputVal = change.currentValue as unknown;

      if (typeof inputVal === 'function') {
        continue;
      }
      (this.elementRef as UnknownCustomElement)[inputName] = inputVal;
    }
  }
}
