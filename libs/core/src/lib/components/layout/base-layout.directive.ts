import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type Signal,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { parentContains } from '@namnguyen191/common-js-helper/dom-utils';

import { LayoutTemplateService } from '../../services/templates/layout-template.service';
import type { LayoutTemplate } from '../../services/templates/layout-template-interfaces';
import type { ConfigWithStatus } from '../../services/templates/shared-types';

@Directive({
  host: {
    '[attr.layoutId]': 'layoutId()',
  },
})
export class BaseLayoutDirective<T extends LayoutTemplate> {
  readonly #layoutService = inject(LayoutTemplateService<T>);
  readonly #elementRef = inject(ElementRef);

  layoutId: InputSignal<string> = input.required<string>();

  layoutConfig: Signal<ConfigWithStatus<T> | undefined> = computedFromObservable(() => {
    const layoutId = this.layoutId();
    return this.#layoutService.getTemplate(layoutId);
  });

  isInfinite: Signal<boolean> = computed(() => {
    const layoutId = this.layoutId();
    const curEle = this.#elementRef.nativeElement as HTMLElement;

    const isInfinite = parentContains({
      ele: curEle,
      attrName: 'layoutId',
      attrValue: layoutId,
    });

    if (isInfinite) {
      console.error(`Layout with id ${layoutId} has already existed in parents`);
    }

    return isInfinite;
  });
}
