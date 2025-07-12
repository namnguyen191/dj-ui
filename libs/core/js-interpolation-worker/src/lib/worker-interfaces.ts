import type { Tagged } from 'type-fest';
import { z } from 'zod';

export const ZBaseWorkerEventPayload = z.strictObject({
  id: z.string(),
});
export type BaseWorkerEventPayload = z.infer<typeof ZBaseWorkerEventPayload>;

export const ZInterpolateWorkerEventPayload = ZBaseWorkerEventPayload.extend({
  rawJs: z.string(),
  context: z.record(z.string(), z.unknown()),
});
export type InterpolateWorkerEventPayload = z.infer<typeof ZInterpolateWorkerEventPayload>;
export const ZInterpolateWorkerEvent = z.strictObject({
  type: z.literal('INTERPOLATE'),
  payload: ZInterpolateWorkerEventPayload,
});
export type InterpolateWorkerEvent = z.infer<typeof ZInterpolateWorkerEvent>;

export const INTERPOLATION_ERROR_MESSAGE = 'Interpolation failed';

export type FailedInterpolationResult = {
  error: typeof INTERPOLATION_ERROR_MESSAGE;
};

export function isFailedInterpolationResult(result: unknown): result is FailedInterpolationResult {
  return !!(
    result &&
    typeof result === 'object' &&
    'error' in result &&
    result.error === INTERPOLATION_ERROR_MESSAGE
  );
}

export type WorkerResponse =
  | {
      id: string;
      result: FailedInterpolationResult;
    }
  | {
      id: string;
      result: unknown;
    };

export type RawJsString = Tagged<string, 'RawJsString'>;
