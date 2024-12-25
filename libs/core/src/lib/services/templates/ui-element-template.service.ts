import { Injectable } from '@angular/core';
import { EmptyObject, UnknownRecord } from 'type-fest';

import { UIElementRequiredConfigs } from '../../components/base-ui-element.component';
import { ActionHook } from '../events-and-actions/action-hook.service';
import { StateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, MissingTemplateEvent } from './base-template.service';
import { ConfigWithStatus } from './shared-types';

export type UIElementTemplateOptions<T extends UnknownRecord = EmptyObject> =
  Partial<UIElementRequiredConfigs> & Partial<T>;

export type UnknownEvent = 'unknown-event';
export type NoEvent = 'no-event';
export type EventsToHooksMap<TEvents extends string = UnknownEvent> = {
  [K in TEvents]?: ActionHook[];
};
type HaveEventHooks<TEvents extends string = UnknownEvent> = TEvents extends UnknownEvent
  ? { eventsHooks?: EventsToHooksMap }
  : TEvents extends NoEvent
    ? Record<string, never>
    : { eventsHooks?: EventsToHooksMap<TEvents> };
export type UIElementTemplate<
  TConfigs extends UnknownRecord = EmptyObject,
  TEvents extends string = UnknownEvent,
> = {
  id: string;
  type: string;
  remoteResourceIds?: string[];
  stateSubscription?: StateSubscriptionConfig;
  options: UIElementTemplateOptions<TConfigs>;
} & HaveEventHooks<TEvents>;

export type UIElementTemplateWithStatus = ConfigWithStatus<UIElementTemplate>;

@Injectable({
  providedIn: 'root',
})
export class UIElementTemplateService extends BaseTemplateService<UIElementTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent = 'MISSING_UI_ELEMENT_TEMPLATE';
}
