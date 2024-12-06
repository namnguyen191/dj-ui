import { inject, Injectable } from '@angular/core';
import {
  isFailedInterpolationResult,
  JSRunnerContext,
  RawJsString,
  WorkerEventObject,
  WorkerResponse,
} from '@dj-ui/core/js-interpolation-worker';
import { isEmpty } from 'lodash-es';
import { BehaviorSubject, filter, firstValueFrom, map } from 'rxjs';
import { UnknownRecord } from 'type-fest';
import { z } from 'zod';

import { CREATE_JS_RUNNER_WORKER, INTERPOLATION_REGEX } from '../global';

export const ZodInterpolationString = z.string().regex(INTERPOLATION_REGEX);

@Injectable({
  providedIn: 'root',
})
export class InterpolationService {
  readonly #jsRunnerWorker: Worker;
  #workerMessagesSubject = new BehaviorSubject<WorkerResponse | null>(null);

  constructor() {
    try {
      const createWorkerRunner = inject(CREATE_JS_RUNNER_WORKER);
      this.#jsRunnerWorker = createWorkerRunner();
    } catch (_error) {
      throw new Error(
        'You will need to provide a function to create a worker through the CREATE_JS_RUNNER_WORKER token. Please refer to the docs on how to do this'
      );
    }

    this.#jsRunnerWorker.onmessage = (e: MessageEvent<WorkerResponse>): void => {
      this.#workerMessagesSubject.next(e.data);
    };
  }

  async interpolate(params: { value: unknown; context: UnknownRecord }): Promise<unknown> {
    const { value, context } = params;
    if (!value || isEmpty(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return this.#interpolateString({
        stringContent: value,
        context,
      });
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return this.#interpolateArray({
          array: value,
          context,
        });
      }

      return this.#interpolateObject({
        object: value as UnknownRecord,
        context,
      });
    }

    return value;
  }

  checkForInterpolation(value: unknown): boolean {
    if (!value || isEmpty(value)) {
      return false;
    }

    if (typeof value === 'string') {
      return this.#extractRawJs(value) !== null;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return this.#checkForInterpolationInArray(value);
      }

      return this.#checkForInterpolationInObject(value as UnknownRecord);
    }

    return false;
  }

  #interpolateRawJs(params: { rawJs: RawJsString; context: JSRunnerContext }): Promise<unknown> {
    const { rawJs, context } = params;

    const id = Math.random().toString();
    const interpolateEvent: WorkerEventObject = {
      type: 'INTERPOLATE',
      payload: {
        id,
        rawJs,
        context,
      },
    };
    this.#jsRunnerWorker.postMessage(interpolateEvent);

    return firstValueFrom(
      this.#workerMessagesSubject.pipe(
        filter((msg): msg is WorkerResponse => msg?.id === id),
        map((msg) => {
          if (isFailedInterpolationResult(msg.result)) {
            throw new Error('Failed to interpolate rawJs');
          }

          return msg.result;
        })
      )
    );
  }

  #extractRawJs(input: string): RawJsString | null {
    if (INTERPOLATION_REGEX.test(input)) {
      return INTERPOLATION_REGEX.exec(input)?.[2] as RawJsString;
    }
    return null;
  }

  async #interpolateString(params: {
    stringContent: string;
    context: UnknownRecord;
  }): Promise<unknown> {
    const { context, stringContent } = params;
    const trimmedStringContent = stringContent.trim();
    const rawJs = this.#extractRawJs(trimmedStringContent);
    if (rawJs) {
      return await this.#interpolateRawJs({
        rawJs: rawJs as RawJsString,
        context: context,
      });
    }

    return stringContent;
  }

  async #interpolateObject<T extends UnknownRecord>(params: {
    context: UnknownRecord;
    object: T;
  }): Promise<T> {
    const { context, object } = params;
    const clonedObject = structuredClone(object);
    for (const [key, val] of Object.entries(clonedObject)) {
      clonedObject[key as keyof T] = (await this.interpolate({
        value: val,
        context: context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;
    }

    return clonedObject;
  }

  async #interpolateArray<T extends unknown[]>(params: {
    context: UnknownRecord;
    array: T;
  }): Promise<T> {
    const { context, array } = params;
    const clonedArray = structuredClone(array);
    for (let i = 0; i < clonedArray.length; i++) {
      const val = clonedArray[i];
      clonedArray[i] = (await this.interpolate({
        value: val,
        context: context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;
    }
    return clonedArray;
  }

  #checkForInterpolationInArray(arr: unknown[]): boolean {
    let result = false;
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      result = result || this.checkForInterpolation(val);
    }
    return result;
  }

  #checkForInterpolationInObject(obj: UnknownRecord): boolean {
    let result = false;
    for (const val of Object.values(obj)) {
      result = result || this.checkForInterpolation(val);
    }

    return result;
  }
}
