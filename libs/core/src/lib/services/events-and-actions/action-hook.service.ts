import { Injectable } from '@angular/core';
import type { JsonValue } from 'type-fest';
import { z } from 'zod';

export type ActionHook<TType extends string = string, TPayload extends JsonValue = JsonValue> = {
  type: TType;
  payload?: TPayload;
};
export const ZGenericActionHook = z.strictObject({
  type: z.string(),
  payload: z.any(),
}) satisfies z.ZodType<ActionHook>;

export type ActionHookHandler<T extends ActionHook['payload']> = (payload: T) => void;

export type ActionHookHandlerAndPayloadParserMap = {
  [hookId: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: ActionHookHandler<any>;
    actionHookSchema?: z.ZodType<ActionHook>;
  };
};

@Injectable({
  providedIn: 'root',
})
export class ActionHookService {
  #actionHookHandlerAndPayloadParserMap: ActionHookHandlerAndPayloadParserMap = {};

  registerHook<T extends ActionHook['payload'] = never>(params: {
    hookId: string;
    handler: ActionHookHandler<T>;
    actionHookSchema?: z.ZodType<ActionHook>;
  }): void {
    const { hookId, handler, actionHookSchema } = params;
    const existing = this.#actionHookHandlerAndPayloadParserMap[hookId];
    if (existing) {
      console.warn(`The hook ${hookId} has already existed. Registering it again will override it`);
    }

    this.#actionHookHandlerAndPayloadParserMap[hookId] = {
      handler,
      actionHookSchema,
    };
  }

  registerHooks(handlersAndParsersMap: ActionHookHandlerAndPayloadParserMap): void {
    Object.entries(handlersAndParsersMap).forEach(([hookId, { handler, actionHookSchema }]) => {
      this.registerHook({
        hookId,
        handler,
        actionHookSchema,
      });
    });
  }

  triggerActionHook(hook: ActionHook): void {
    const handler = this.#actionHookHandlerAndPayloadParserMap[hook.type]?.handler;
    if (!handler) {
      console.warn(`No handler for hook ${hook.type}`);

      return;
    }

    const actionHookSchema =
      this.#actionHookHandlerAndPayloadParserMap[hook.type]?.actionHookSchema;
    if (actionHookSchema) {
      try {
        actionHookSchema.parse(hook.payload);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.warn(
            `Receiving: ${JSON.stringify(hook)} which is an invalid hook: ${error.message}`
          );
        } else {
          console.warn(
            `An unknown error has occured while trying to parse ${JSON.stringify(hook)}. Nothing will be be triggered`
          );
        }

        return;
      }
    }

    handler(hook.payload);
  }

  triggerActionHooks(hooks: ActionHook[]): void {
    hooks.forEach((hook) => {
      this.triggerActionHook(hook);
    });
  }
}
