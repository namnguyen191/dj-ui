import { inject, Injectable } from '@angular/core';
import { get, isEqual, set } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
  type UnaryFunction,
} from 'rxjs';
import type { UnknownRecord } from 'type-fest';
import { z } from 'zod';

import { logInfo } from '../utils/logging';
import { InterpolationService } from './interpolation.service';

export const ZodAvailableStateScope = z.enum(['global', 'local']);
export type AvailableStateScope = z.infer<typeof ZodAvailableStateScope>;

export type StateMap = {
  [K in AvailableStateScope]: UnknownRecord;
} & {
  variables?: UnknownRecord;
};

export type WatchedPath = string;
export type StateSubscriptionConfig = {
  watchedScopes?: {
    [K in AvailableStateScope]?: WatchedPath[];
  };
  variables?: Record<string, unknown>;
};
export const ZStateSubscriptionConfig = z.strictObject({
  watchedScopes: z
    .strictObject({
      global: z.array(z.string()).optional(),
      local: z.array(z.string()).optional(),
    })
    .optional(),
  variables: z.record(z.any()).optional(),
}) satisfies z.ZodType<StateSubscriptionConfig>;

export const getStatesAsContext = (): Observable<StateMap> => {
  const stateStoreService = inject(StateStoreService);

  const local: Observable<UnknownRecord> = stateStoreService.getLocalState();

  const global: Observable<UnknownRecord> = stateStoreService.getGlobalState();

  return combineLatest({
    global,
    local,
  });
};

export const getStatesSubscriptionAsContext = (
  stateSubscription: StateSubscriptionConfig,
  requesterIdentity?: string
): Observable<StateMap> => {
  const { watchedScopes, variables } = stateSubscription;

  const localSubscription = watchedScopes?.local ?? [];
  const globalSubscription = watchedScopes?.global ?? [];

  const stateStoreService = inject(StateStoreService);
  const interpolationService = inject(InterpolationService);

  const local: Observable<UnknownRecord> = localSubscription
    ? stateStoreService.getLocalStateByPaths(localSubscription)
    : of({});

  const global: Observable<UnknownRecord> = globalSubscription
    ? stateStoreService.getGlobalStateByPaths(globalSubscription)
    : of({});

  return combineLatest({
    global,
    local,
  }).pipe(
    tap({
      next: () => {
        if (requesterIdentity) {
          logInfo(`States requested by "${requesterIdentity}"`);
        }
      },
    }),
    switchMap((state) => {
      if (!variables) {
        return of({ ...state });
      }

      return interpolationService
        .interpolate({
          value: variables,
          context: {
            state,
          },
        })
        .pipe(map((interpolatedVariables) => ({ ...state, variables: interpolatedVariables })));
    })
  );
};

@Injectable({
  providedIn: 'root',
})
export class StateStoreService {
  #globalState = new BehaviorSubject<UnknownRecord>({});
  #localState = new BehaviorSubject<UnknownRecord>({});

  getGlobalState(): Observable<UnknownRecord> {
    return this.#globalState.asObservable();
  }

  getGlobalStateByPaths(paths: string[]): Observable<UnknownRecord> {
    return this.#globalState.asObservable().pipe(this.watchStatePaths(paths));
  }

  getLocalState(): Observable<UnknownRecord> {
    return this.#localState.asObservable();
  }

  getLocalStateByPaths(paths: string[]): Observable<UnknownRecord> {
    return this.#localState.asObservable().pipe(this.watchStatePaths(paths));
  }

  addToState(params: { scope: AvailableStateScope; data: UnknownRecord }): void {
    const { scope, data } = params;

    switch (scope) {
      case 'global': {
        const oldGLobalState = this.#globalState.getValue();
        this.#globalState.next({
          ...oldGLobalState,
          ...data,
        });
        break;
      }
      case 'local': {
        const oldLocalState = this.#localState.getValue();
        this.#localState.next({
          ...oldLocalState,
          ...data,
        });
        break;
      }
      default:
        console.warn('Unknown state scope: ', scope);
    }
  }

  watchStatePaths(
    paths: string[]
  ): UnaryFunction<Observable<UnknownRecord>, Observable<UnknownRecord>> {
    return pipe(
      map((state) => {
        const mappedState = {};
        for (const path of paths) {
          const statePiece = get(state, path);
          set(mappedState, path, statePiece);
        }

        return mappedState;
      }),
      distinctUntilChanged((prevState, curState) => isEqual(prevState, curState))
    );
  }
}
