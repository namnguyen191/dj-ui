import { inject } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { UnknownRecord } from 'type-fest';

import { StateMap } from '../state-store.service';
import { RemoteResourceService } from './remote-resource.service';

export type RemoteResourceState = {
  status: 'init' | 'completed' | 'error';
  isLoading: boolean;
  isError: boolean;
  result: unknown | null;
};

export type RemoteResourcesStates = {
  results: {
    [remoteResourceId: string]: RemoteResourceState;
  };
  isAllLoading: boolean;
  isPartialLoading: string[];
  isAllError: boolean;
  isPartialError: string[];
};

export type RequestConfigsInterpolationContext = {
  state: StateMap | null;
  $requests?: AccumulatedRequestsResults;
};

export type RequestTransformationInterpolationContext = RequestConfigsInterpolationContext & {
  $current: unknown;
};

export type RequestHooksInterpolationContext = {
  state: StateMap | null;
  $result: unknown;
};

export type FetcherIdToConfigMap = {
  fetcherId: string;
  configs: UnknownRecord;
}[];
export type AccumulatedRequestsResults = unknown[];

export const getRemoteResourcesStatesAsContext = (
  remoteResourceIds: string[]
): Observable<RemoteResourcesStates> => {
  const remoteResourceService = inject(RemoteResourceService);

  const remoteResourcesStatesMap: { [id: string]: Observable<RemoteResourceState> } =
    remoteResourceIds.reduce(
      (acc, curId) => ({ ...acc, [curId]: remoteResourceService.getRemoteResourceState(curId) }),
      {}
    );

  return combineLatest(remoteResourcesStatesMap).pipe(
    map((statesMap) => {
      const isAllLoading = Object.entries(statesMap).every(([, state]) => state.isLoading);
      const isPartialLoading: string[] = Object.entries(statesMap).reduce(
        (acc, [curId, curState]) => {
          if (curState.isLoading) {
            return [...acc, curId];
          }

          return acc;
        },
        [] as string[]
      );
      const isAllError = Object.entries(statesMap).every(([, state]) => state.isError);
      const isPartialError: string[] = Object.entries(statesMap).reduce(
        (acc, [curId, curState]) => {
          if (curState.isError) {
            return [...acc, curId];
          }

          return acc;
        },
        [] as string[]
      );

      return {
        results: statesMap,
        isAllLoading,
        isPartialLoading,
        isAllError,
        isPartialError,
      };
    })
  );
};
