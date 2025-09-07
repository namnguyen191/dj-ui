import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ZodObjectType } from '@dj-ui/common/shared';
import {
  type ActionHook,
  type ActionHookHandler,
  RemoteResourceService,
  StateStoreService,
  ZodAvailableStateScope,
} from '@dj-ui/core';
import { z } from 'zod';

export const ZTriggerRemoteResourceHookPayload = z.strictObject(
  {
    remoteResourceId: z.string(),
  },
  {
    error: () => ({
      message:
        'Invalid triggerRemoteResource action hook payload, example: { "type": "triggerRemoteResource", "payload": { "remoteResourceId": "123" }  } ',
    }),
  }
);
export type TriggerRemoteResourceHookPayload = z.infer<typeof ZTriggerRemoteResourceHookPayload>;
export const ZTriggerRemoteResourceActionHook = z.strictObject({
  type: z.literal('triggerRemoteResource'),
  payload: ZTriggerRemoteResourceHookPayload,
}) satisfies z.ZodType<ActionHook>;
export type TriggerRemoteResourceActionHook = z.infer<typeof ZTriggerRemoteResourceActionHook>;

export const ZAddToStateActionHookPayload = z.strictObject(
  {
    scope: ZodAvailableStateScope,
    data: ZodObjectType,
  },
  {
    error: () => ({
      message:
        'Invalid addToState action hook payload, example: { "type": "addToState", "payload": { "scope": "global", data: "{ "some": "data" }" }  } ',
    }),
  }
);
export type AddToStateActionHookPayload = z.infer<typeof ZAddToStateActionHookPayload>;
export const ZAddToStateActionHook = z.strictObject({
  type: z.literal('addToState'),
  payload: ZAddToStateActionHookPayload,
}) satisfies z.ZodType<ActionHook>;
export type AddToStateActionHook = z.infer<typeof ZAddToStateActionHook>;

export const ZNavigateHookPayload = z.strictObject(
  {
    navigationType: z.union([z.literal('internal'), z.literal('external')]),
    url: z.string(),
  },
  {
    error: () => ({
      message:
        'Invalid navigate action hook payload, example: { "type": "navigate", "payload": { "navigationType": "internal", url: "/my/route" }  } ',
    }),
  }
);
export type NavigateHookPayload = z.infer<typeof ZNavigateHookPayload>;
export const ZNavigateActionHook = z.strictObject({
  type: z.literal('navigate'),
  payload: ZNavigateHookPayload,
}) satisfies z.ZodType<ActionHook>;
export type NavigateActionHook = z.infer<typeof ZNavigateActionHook>;

@Injectable({
  providedIn: 'root',
})
export class DefaultActionsHooksService {
  readonly #remoteResourceService = inject(RemoteResourceService);
  readonly #stateStoreService = inject(StateStoreService);
  readonly #router = inject(Router);

  handleTriggerRemoteResource: ActionHookHandler<TriggerRemoteResourceHookPayload> = ({
    remoteResourceId,
  }): void => {
    this.#remoteResourceService.triggerResource(remoteResourceId);
  };

  handleAddToState: ActionHookHandler<AddToStateActionHookPayload> = (payload): void => {
    this.#stateStoreService.addToState(payload);
  };

  navigate: ActionHookHandler<NavigateHookPayload> = ({ navigationType, url }) => {
    if (navigationType === 'internal') {
      void this.#router.navigateByUrl(url);
    } else {
      window.open(url, '_blank')?.focus();
    }
  };
}
