import { Injectable } from '@angular/core';

import { ActionHook } from '../events-and-actions/action-hook.service';
import { StateSubscriptionConfig } from '../state-store.service';
import { BaseTemplateService, MissingTemplateEvent } from './base-template.service';
import { ConfigWithStatus } from './shared-types';

export type Request = {
  fetcherId: string;
  configs: unknown;
  interpolation?: string;
};

export type RemoteResourceTemplate = {
  id: string;
  stateSubscription?: StateSubscriptionConfig;
  options: {
    runCondition?: boolean;
    requests: Request[];
    onSuccess?: ActionHook[];
    parallel?: boolean;
  };
};

export type RemoteResourceTemplateTypeForJsonSchema = RemoteResourceTemplate;

export type RemoteResourceTemplateWithStatus = ConfigWithStatus<RemoteResourceTemplate>;

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceTemplateService extends BaseTemplateService<RemoteResourceTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent =
    'MISSING_REMOTE_RESOURCE_TEMPLATE';
}
