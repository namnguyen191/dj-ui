import { inject, Injectable } from '@angular/core';
import { get, isEqual, set } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
  UnaryFunction,
} from 'rxjs';
import { UnknownRecord } from 'type-fest';
import { z } from 'zod';

import { InterpolationService } from './interpolation.service';

export const ZodAvailableStateScope = z.enum(['global', 'local', 'layout']);
export type AvailableStateScope = z.infer<typeof ZodAvailableStateScope>;

export type StateMap = {
  [K in AvailableStateScope]: UnknownRecord;
} & {
  variables?: UnknownRecord;
};

export type WatchedPath = string;
export type StateSubscriptionConfig = {
  watchedScopes: {
    [K in AvailableStateScope]?: WatchedPath[];
  };
  variables?: Record<string, unknown>;
};

export const getStatesAsContext = (): Observable<StateMap> => {
  const stateStoreService = inject(StateStoreService);

  const local: Observable<UnknownRecord> = stateStoreService.getLocalState();

  const global: Observable<UnknownRecord> = stateStoreService.getGlobalState();

  const layout: Observable<UnknownRecord> = stateStoreService.getLayoutState();

  return combineLatest({
    global,
    local,
    layout,
  });
};

export const getStatesSubscriptionAsContext = (
  stateSubscription: StateSubscriptionConfig
): Observable<StateMap> => {
  const { watchedScopes, variables } = stateSubscription;

  const {
    local: localSubscription,
    layout: layoutSubscription,
    global: globalSubscription,
  } = watchedScopes;

  const stateStoreService = inject(StateStoreService);
  const interpolationService = inject(InterpolationService);

  const local: Observable<UnknownRecord> = localSubscription
    ? stateStoreService.getLocalStateByPaths(localSubscription)
    : of({});

  const global: Observable<UnknownRecord> = globalSubscription
    ? stateStoreService.getGlobalStateByPaths(globalSubscription)
    : of({});

  const layout: Observable<UnknownRecord> = layoutSubscription
    ? stateStoreService.getLayoutStateByPaths(layoutSubscription)
    : of({});

  return combineLatest({
    global,
    local,
    layout,
  }).pipe(
    switchMap((state) => {
      if (!variables) {
        return of({ ...state });
      }

      return from(
        interpolationService.interpolate({
          value: variables,
          context: {
            state,
          },
        })
      ).pipe(map((interpolatedVariables) => ({ ...state, variables: interpolatedVariables })));
    }),
    tap((val) => console.log('Nam data is: result', val))
  );
};

@Injectable({
  providedIn: 'root',
})
export class StateStoreService {
  #globalState: BehaviorSubject<UnknownRecord> = new BehaviorSubject({});
  #layoutState: BehaviorSubject<UnknownRecord> = new BehaviorSubject({});
  #localState: BehaviorSubject<UnknownRecord> = new BehaviorSubject({});

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

  getLayoutState(): Observable<UnknownRecord> {
    return this.#layoutState.asObservable();
  }

  getLayoutStateByPaths(paths: string[]): Observable<UnknownRecord> {
    return this.#layoutState.asObservable().pipe(this.watchStatePaths(paths));
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
      case 'layout': {
        const oldLayoutState = this.#layoutState.getValue();
        this.#layoutState.next({
          ...oldLayoutState,
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
