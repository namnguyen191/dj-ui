import type { UnknownRecord } from 'type-fest';

import type { StateMap } from '../state-store.service';

export type RemoteResourceState = {
  status: 'init' | 'completed' | 'error';
  isLoading: boolean;
  isError: boolean;
  result: unknown;
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
