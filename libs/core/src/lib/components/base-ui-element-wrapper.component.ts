import {
  ComponentRef,
  Directive,
  input,
  type Signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import type { UIElementTemplate } from '../services/templates/ui-element-template.service';
import type { BaseUIElementComponent } from './base-ui-element.component';

@Directive()
export abstract class BaseUIElementWrapperComponent {
  protected uiElementTemplate = input.required<UIElementTemplate>();
  protected uiElementComponentRef = input.required<ComponentRef<BaseUIElementComponent>>();

  uiElementVCR: Signal<ViewContainerRef | undefined> = viewChild('uiElementVCR', {
    read: ViewContainerRef,
  });

  static readonly EXCLUDED_ELEMENTS: Set<symbol> | undefined;
}
