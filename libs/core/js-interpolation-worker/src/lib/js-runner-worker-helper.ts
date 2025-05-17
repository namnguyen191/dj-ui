import type { UnknownRecord } from 'type-fest';

import type {
  FailedInterpolationResult,
  InterpolateWorkerEvent,
  WorkerResponse,
} from './worker-interfaces';
import { INTERPOLATION_ERROR_MESSAGE } from './worker-interfaces';

export type JSRunnerContext = UnknownRecord;

export const runRawJs = (
  rawJs: string,
  context: JSRunnerContext,
  allowList?: Set<string>
): unknown => {
  let contextOverride = '';
  if (allowList) {
    contextOverride = restrictCurrentExecutionContextGlobal(allowList);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-member-access
  const result: unknown = new Function(`${contextOverride}${rawJs}`).bind(context).call();
  return result;
};

export const handleRunJsMessage = (
  e: MessageEvent<InterpolateWorkerEvent>,
  allowList?: Set<string>
): void => {
  const {
    data: {
      payload: { rawJs, context, id },
    },
  } = e;
  let result: unknown;

  try {
    result = runRawJs(rawJs, context, allowList);
  } catch (error) {
    console.warn(`Getting error: ${error}. \nFrom running: ${rawJs}.`);
    result = { error: INTERPOLATION_ERROR_MESSAGE } as FailedInterpolationResult;
  }

  const response: WorkerResponse = {
    result,
    id,
  };

  postMessage(response);
};

export const REQUIRED_ALLOW_LIST = new Set<string>(['undefined', 'null']);

export const restrictCurrentExecutionContextGlobal = (allowList: Set<string>): string => {
  const seenProperties: Set<string> = new Set<string>();

  let currentContext: unknown = globalThis;
  do {
    const props = Object.getOwnPropertyNames(currentContext);
    props.forEach((prop) => {
      seenProperties.add(prop);
    });
    currentContext = Object.getPrototypeOf(currentContext);
  } while (currentContext);

  let contextOverride: string = '';
  const finalAllowList = new Set<string>([...allowList, ...REQUIRED_ALLOW_LIST]);
  seenProperties.forEach((prop) => {
    if (!finalAllowList.has(prop)) {
      // Object.defineProperty(context, prop, {
      //   get: () => {
      //     throw Error(`"${prop}" is forbidden`);
      //   },
      //   configurable: false,
      // });
      contextOverride += `const ${prop} = undefined;`;
    }
  });
  return contextOverride;
};
