import { InjectionToken, Type } from '@angular/core';

import { UIElementExtraWrapperBaseComponent } from './ui-element-extra-wrapper-base.component';

export type CoreLayoutConfig = {
  uiElementLoadingComponent?: Type<unknown>;
  uiElementExtraWrapperComponent?: Type<UIElementExtraWrapperBaseComponent>;
};
export const CORE_LAYOUT_CONFIG = new InjectionToken<CoreLayoutConfig>('CORE_LAYOUT_CONFIG');
