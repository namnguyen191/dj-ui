import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import type { ActionHook } from '../events-and-actions/action-hook.service';
import { InterpolationService } from '../interpolation.service';
import {
  getStatesSubscriptionAsContext,
  type StateSubscriptionConfig,
} from '../state-store.service';
import type { RemoteResourceTemplate } from '../templates/remote-resource-template.service';
import type {
  AccumulatedRequestsResults,
  RemoteResourceState,
  RequestConfigsInterpolationContext,
  RequestHooksInterpolationContext,
  RequestTransformationInterpolationContext,
} from './remote-resource.interface';

export abstract class BaseRemoteResourceService {
  protected readonly environmentInjector = inject(EnvironmentInjector);
  protected readonly interpolationService = inject(InterpolationService);

  abstract getRemoteResourceState(id: string): Observable<RemoteResourceState>;

  abstract triggerResource(id: string): void;

  abstract reloadResource(id: string): void;

  protected setLoadingState(remoteResourceState: BehaviorSubject<RemoteResourceState>): void {
    const currentRemoteResourceState = remoteResourceState.getValue();
    remoteResourceState.next({
      ...currentRemoteResourceState,
      isLoading: true,
    });
  }

  protected setErrorState(remoteResourceState: BehaviorSubject<RemoteResourceState>): void {
    remoteResourceState.next({
      status: 'error',
      isLoading: false,
      isError: true,
      result: null,
    });
  }

  protected setCompleteState(
    remoteResourceState: BehaviorSubject<RemoteResourceState>,
    result: unknown
  ): void {
    remoteResourceState.next({
      status: 'completed',
      isLoading: false,
      isError: false,
      result,
    });
  }

  protected interpolateResourceHooks(params: {
    onSuccessHooks: Exclude<RemoteResourceTemplate['options']['onSuccess'], undefined>;
    resourceResult: unknown;
    stateSubscription?: StateSubscriptionConfig;
  }): Observable<ActionHook[]> {
    const { onSuccessHooks, resourceResult, stateSubscription } = params;

    const resourceHooksInterpolationContext$ = this.getResourceRequestHooksInterpolationContext(
      resourceResult,
      stateSubscription
    );
    const interpolatedHooks$ = resourceHooksInterpolationContext$.pipe(
      switchMap((ctx) =>
        this.interpolationService.interpolate({
          value: onSuccessHooks,
          context: ctx,
        })
      ),
      catchError(() => {
        console.warn('Failed to interpolate resource hooks');
        return of([]);
      })
    );

    return interpolatedHooks$ as Observable<ActionHook[]>;
  }

  protected getResourceRequestConfigInterpolationContext(
    accumulatedRequestsResults: AccumulatedRequestsResults,
    stateSubscriptionConfig?: StateSubscriptionConfig
  ): Observable<RequestConfigsInterpolationContext> {
    const state = stateSubscriptionConfig
      ? runInInjectionContext(this.environmentInjector, () =>
          getStatesSubscriptionAsContext(stateSubscriptionConfig)
        )
      : of(null);
    const $requests = of(accumulatedRequestsResults);

    return combineLatest({
      $requests,
      state,
    }).pipe(
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );
  }

  protected getResourceRequestTransformationInterpolationContext(params: {
    accumulatedRequestsResults?: AccumulatedRequestsResults;
    currentRequestResult?: unknown;
    stateSubscriptionConfig?: StateSubscriptionConfig;
  }): Observable<RequestTransformationInterpolationContext> {
    const { accumulatedRequestsResults, currentRequestResult, stateSubscriptionConfig } = params;
    const state = stateSubscriptionConfig
      ? runInInjectionContext(this.environmentInjector, () =>
          getStatesSubscriptionAsContext(stateSubscriptionConfig)
        )
      : of(null);
    const $requests = of(accumulatedRequestsResults);
    const $current = of(currentRequestResult);

    return combineLatest({
      $requests,
      state,
      $current,
    }).pipe(
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );
  }

  protected getResourceRequestHooksInterpolationContext(
    transformationResult: unknown,
    stateSubscription?: StateSubscriptionConfig
  ): Observable<RequestHooksInterpolationContext> {
    const state = stateSubscription
      ? runInInjectionContext(this.environmentInjector, () =>
          getStatesSubscriptionAsContext(stateSubscription)
        )
      : of(null);
    const $result = of(transformationResult);

    return combineLatest({
      $result,
      state,
    }).pipe(
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );
  }
}
