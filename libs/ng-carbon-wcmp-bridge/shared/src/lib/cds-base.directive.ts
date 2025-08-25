import { Directive, ElementRef, inject, type OnChanges, type SimpleChanges } from '@angular/core';

type UnknownCustomElement = HTMLElement & Record<string, unknown>;

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
