import { ComponentRef, Directive, input, Signal, viewChild, ViewContainerRef } from '@angular/core';

import { UIElementInstance } from '../../services/templates/layout-template-interfaces';
import { UIElementTemplate } from '../../services/templates/ui-element-template.service';
import { BaseUIElementComponent } from '../base-ui-element.component';

@Directive()
export class UIElementExtraWrapperBaseComponent {
  protected uiElementTemplate = input.required<UIElementTemplate>();
  protected uiElementInstance = input.required<UIElementInstance>();
  protected uiElementComponentRef = input.required<ComponentRef<BaseUIElementComponent>>();

  public uiElementVCR: Signal<ViewContainerRef | undefined> = viewChild('uiElementVCR', {
    read: ViewContainerRef,
  });
}
