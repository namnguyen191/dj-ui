import { inject, Injectable } from '@angular/core';
import {
  type InterpolateWorkerEvent,
  isFailedInterpolationResult,
  type JSRunnerContext,
  type RawJsString,
  type WorkerResponse,
} from '@dj-ui/core/js-interpolation-worker';
import { isEmpty } from 'lodash-es';
import {
  BehaviorSubject,
  filter,
  first,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
  timeout,
} from 'rxjs';
import type { UnknownRecord } from 'type-fest';
import { z } from 'zod';

import { CREATE_JS_RUNNER_WORKER, INTERPOLATION_REGEX, MAX_WORKER_POOl } from '../global';
import { logError } from '../utils/logging';

export const ZodInterpolationString = z.string().regex(INTERPOLATION_REGEX);

type WorkerInPool = {
  id: number;
  isBusy: boolean;
  worker: Worker;
};

@Injectable({
  providedIn: 'root',
})
export class InterpolationService {
  readonly MAX_WORKER_POOl = inject(MAX_WORKER_POOl, { optional: true }) ?? 4;
  readonly #jsRunnerWorkerPool: WorkerInPool[] = [];
  #workerMessagesSubject = new BehaviorSubject<WorkerResponse | null>(null);
  #createWorkerRunner: () => Worker;

  constructor() {
    try {
      this.#createWorkerRunner = inject(CREATE_JS_RUNNER_WORKER);

      for (let i = 0; i < this.MAX_WORKER_POOl; i++) {
        const createdWorker = this.#createAndSetupWorker();
        this.#jsRunnerWorkerPool.push({
          id: i,
          isBusy: false,
          worker: createdWorker,
        });
      }
    } catch (_error) {
      throw new Error(
        'You will need to provide a function to create a worker through the CREATE_JS_RUNNER_WORKER token. Please refer to the docs on how to do this'
      );
    }
  }

  interpolate(params: { value: unknown; context: UnknownRecord }): Observable<unknown> {
    const { value, context } = params;
    if (!value || isEmpty(value)) {
      return of(value);
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

    return of(value);
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

  #interpolateRawJs<T>(params: { rawJs: RawJsString; context: JSRunnerContext }): Observable<T> {
    const { rawJs, context } = params;

    const id = Math.random().toString();
    const interpolateEvent: InterpolateWorkerEvent = {
      type: 'INTERPOLATE',
      payload: {
        id,
        rawJs,
        context,
      },
    };

    const interpolationProcess$ = new Observable((observer) => {
      let workerId: WorkerInPool['id'];
      let responseReceived = false;

      const findingAvailableWorkerWaitTime = 5000;
      const processingJSWaitTime = 5000;
      const totalProcessWaitTime = findingAvailableWorkerWaitTime + processingJSWaitTime;
      const waitForWorkerResponse$ = this.#postEventToAvailableWorker(interpolateEvent).pipe(
        timeout({
          each: findingAvailableWorkerWaitTime,
          with: () => {
            const errorMsg = 'Taking too long to find an available worker';
            logError(errorMsg);
            throw new Error(errorMsg);
          },
        }),
        switchMap((wrkId) => {
          workerId = wrkId;
          return this.#workerMessagesSubject.asObservable();
        }),
        filter((msg): msg is WorkerResponse => msg?.id === id),
        timeout({
          each: totalProcessWaitTime,
          with: () => {
            this.#assertWorkerId(workerId);
            const errorMsg = `Timeout trying to interpolate rawJs because it is running for too long: ${rawJs}`;
            this.#abortWorker(workerId);
            logError(errorMsg);
            throw new Error(errorMsg);
          },
        }),
        map((msg) => {
          if (isFailedInterpolationResult(msg.result)) {
            throw new Error('Failed to interpolate rawJs');
          }
          return msg.result;
        }),
        tap(() => {
          this.#assertWorkerId(workerId);
          this.#markWorkerAsFree(workerId);
          responseReceived = true;
        }),
        first()
      );

      const waitForWorkerResponseSubscription = waitForWorkerResponse$.subscribe({
        next: (val) => {
          observer.next(val);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
          observer.complete();
        },
      });

      return (): void => {
        // Worker is in progress but we have not received a response yet
        if (!responseReceived) {
          this.#abortWorker(workerId);
        }

        waitForWorkerResponseSubscription.unsubscribe();
      };
    });

    return interpolationProcess$ as Observable<T>;
  }

  #extractRawJs(input: string): RawJsString | null {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (input.match(INTERPOLATION_REGEX)?.[2] as RawJsString) ?? null;
  }

  #interpolateString(params: {
    stringContent: string;
    context: UnknownRecord;
  }): Observable<unknown> {
    const { context, stringContent } = params;
    const trimmedStringContent = stringContent.trim();
    const rawJs = this.#extractRawJs(trimmedStringContent);
    if (rawJs) {
      return this.#interpolateRawJs({
        rawJs: rawJs as RawJsString,
        context: context,
      });
    }

    return of(stringContent);
  }

  #interpolateObject<
    TResultObj extends UnknownRecord,
    TInputObj extends Record<keyof TResultObj, unknown>,
  >(params: { context: UnknownRecord; object: TInputObj }): Observable<TResultObj> {
    const { context, object } = params;
    const resultObject: Record<string, Observable<unknown>> = {};
    for (const [key, val] of Object.entries(object)) {
      resultObject[key] = this.interpolate({
        value: val,
        context: context,
      });
    }

    return forkJoin(resultObject) as Observable<TResultObj>;
  }

  #interpolateArray<TItem>(params: {
    context: UnknownRecord;
    array: unknown[];
  }): Observable<TItem[]> {
    const { context, array } = params;
    const resultArray: Observable<TItem>[] = [];
    for (const val of array) {
      resultArray.push(
        this.interpolate({
          value: val,
          context: context,
        }) as Observable<TItem>
      );
    }
    return forkJoin(resultArray);
  }

  #checkForInterpolationInArray(arr: unknown[]): boolean {
    let result = false;
    for (const val of arr) {
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

  #postEventToAvailableWorker(evt: InterpolateWorkerEvent): Observable<number> {
    let searchingForWorkerJobID: number | undefined;
    const workerId$ = new Observable<WorkerInPool['id']>((sub) => {
      const findAvailableWorkerAndSendEvent = (): void => {
        for (const workerInPool of this.#jsRunnerWorkerPool) {
          if (!workerInPool.isBusy) {
            workerInPool.isBusy = true;
            workerInPool.worker.postMessage(evt);
            sub.next(workerInPool.id);
            sub.complete();
            return;
          }
        }

        // re-try if all workers are busy
        searchingForWorkerJobID = window.setTimeout(() => {
          findAvailableWorkerAndSendEvent();
        }, 100);
      };

      findAvailableWorkerAndSendEvent();

      return (): void => {
        if (searchingForWorkerJobID !== undefined) {
          window.clearTimeout(searchingForWorkerJobID);
        }
      };
    });

    return workerId$;
  }

  #abortWorker(id: number): void {
    const foundWorker = this.#jsRunnerWorkerPool.find((w) => w.id === id);
    if (foundWorker) {
      foundWorker.worker.terminate();
      foundWorker.worker = this.#createAndSetupWorker();
      foundWorker.isBusy = false;
    } else {
      logError(`Cannot find worker with ID ${id}`);
    }
  }

  #markWorkerAsFree(id: number): void {
    const foundWorker = this.#jsRunnerWorkerPool.find((w) => w.id === id);
    if (foundWorker) {
      foundWorker.isBusy = false;
    } else {
      logError(`Cannot find worker with ID ${id}`);
    }
  }

  #assertWorkerId(workerId?: WorkerInPool['id']): asserts workerId is WorkerInPool['id'] {
    if (workerId === undefined) {
      throw Error('Worker id is empty');
    }
  }

  #createAndSetupWorker(): Worker {
    const createdWorker = this.#createWorkerRunner();
    createdWorker.onmessage = (e: MessageEvent<WorkerResponse>): void => {
      this.#workerMessagesSubject.next(e.data);
    };
    return createdWorker;
  }
}
