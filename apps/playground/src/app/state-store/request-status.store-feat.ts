import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

export const setPending = (): RequestStatusState => {
  return { requestStatus: 'pending' };
};

export const setFulfilled = (): RequestStatusState => {
  return { requestStatus: 'fulfilled' };
};

export const setError = (error: string): RequestStatusState => {
  return { requestStatus: { error } };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const withRequestStatus = () => {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      isFulfilled: computed(() => requestStatus() === 'fulfilled'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    }))
  );
};
