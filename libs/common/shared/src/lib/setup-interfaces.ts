import { InjectionToken, type Type } from '@angular/core';
import type {
  BaseUIElementComponent,
  RemoteResourceTemplate,
  UIElementLoader,
  UIElementTemplate,
} from '@dj-ui/core';
import type { Observable } from 'rxjs';

export type TemplatesHandlers = {
  getUiElementTemplate?: (id: string) => Observable<UIElementTemplate>;
  getRemoteResourceTemplate?: (id: string) => Observable<RemoteResourceTemplate>;
};
export type ComponentsMap = Record<string, Type<BaseUIElementComponent>>;
export type ComponentLoadersMap = Record<string, UIElementLoader>;
export type SetupConfigs = {
  templatesHandlers?: TemplatesHandlers;
  componentsMap?: ComponentsMap;
  componentLoadersMap?: ComponentLoadersMap;
};
export const COMMON_SETUP_CONFIG = new InjectionToken<SetupConfigs>('COMMON_SETUP_CONFIG');
