import { inject, Injectable, runInInjectionContext } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  expand,
  filter,
  first,
  forkJoin,
  last,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { UnknownRecord } from 'type-fest';

import { logSubscription } from '../../utils/logging';
import { DataFetchingService } from '../data-fetching.service';
import { ActionHookService } from '../events-and-actions/action-hook.service';
import {
  getStatesSubscriptionAsContext,
  StateMap,
  StateSubscriptionConfig,
} from '../state-store.service';
import {
  RemoteResourceTemplate,
  RemoteResourceTemplateService,
  RemoteResourceTemplateWithStatus,
  Request,
} from '../templates/remote-resource-template.service';
import { BaseRemoteResourceService } from './base-remote-resource.service';
import { FetcherIdToConfigMap, RemoteResourceState } from './remote-resource.interface';

export const notRunResource = '[Resource did not run]';

const complete: unique symbol = Symbol('Complete');
const COMPLETE: Observable<typeof complete> = of(complete);

@Injectable({
  providedIn: 'root',
})
export class RemoteResourceService extends BaseRemoteResourceService {
  #remoteResourcesStateMap: Record<string, BehaviorSubject<RemoteResourceState>> = {};
  #reloadControlSubject: Subject<string> = new Subject<string>();
  #cancelSubscriptionControlSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  readonly #dataFetchingService = inject(DataFetchingService);
  readonly #remoteResourceTemplateService = inject(RemoteResourceTemplateService);
  readonly #actionHookService = inject(ActionHookService);

  getRemoteResourceState(id: string): Observable<RemoteResourceState> {
    const remoteResourceState = this.#remoteResourcesStateMap[id];

    if (remoteResourceState) {
      return remoteResourceState.asObservable();
    }

    return this.#initializeRemoteResource(id);
  }

  triggerResource(id: string): void {
    const existingRemoteResourceState = this.#remoteResourcesStateMap[id];
    if (existingRemoteResourceState) {
      this.reloadResource(id);
    } else {
      this.#initializeRemoteResource(id);
    }
  }

  reloadResource(id: string): void {
    this.#reloadControlSubject.next(id);
  }

  #processRequestsInSequence(
    requests: Request[],
    stateSubscriptionConfig?: StateSubscriptionConfig
  ): Observable<unknown> {
    let currentRequestIndex = 0;

    return of([]).pipe(
      expand((accumulatedRequestsResults) => {
        if (currentRequestIndex >= requests.length) {
          return EMPTY;
        }
        const curReq = requests[currentRequestIndex] as Request;
        currentRequestIndex++;
        return this.#interpolateSequencedRequestOptions({
          req: curReq,
          accumulatedRequestsResults,
          stateSubscriptionConfig,
        }).pipe(
          switchMap((interpolatedRequestOptions) =>
            this.#dataFetchingService.fetchData(curReq.fetcherId, interpolatedRequestOptions)
          ),
          switchMap((requestResult) =>
            this.#interpolateSequencedRequestResult(
              curReq,
              requestResult,
              accumulatedRequestsResults
            )
          ),
          map((interpolatedRequestResult) => [
            ...accumulatedRequestsResults,
            interpolatedRequestResult,
          ])
        );
      }),
      last(),
      // The last request result will be used as the final result for the remote resource
      map((accumulatedRequestsResults) => accumulatedRequestsResults[requests.length - 1])
    );
  }

  #processRequestsInParallel(
    requests: Request[],
    stateSubscriptionConfig?: StateSubscriptionConfig
  ): Observable<unknown[]> {
    return this.#interpolateParallelRequestOptions(requests, stateSubscriptionConfig).pipe(
      switchMap((fetcherIdToConfigMap) =>
        forkJoin(
          fetcherIdToConfigMap.map(({ fetcherId, configs }) =>
            this.#dataFetchingService.fetchData(fetcherId, configs)
          )
        )
      ),
      switchMap((responses) =>
        this.#interpolateParallelRequestsResult({
          reqs: requests,
          responses,
          stateSubscriptionConfig,
        })
      )
    );
  }

  #initializeDataFetchingFlow(id: string): void {
    const remoteResourceState = this.#remoteResourcesStateMap[id];
    if (!remoteResourceState) {
      console.warn(
        `Remote resource ${id} has not been registered or is not associated with any widget yet`
      );
      return;
    }

    const remoteResourceTemplate$ = this.#remoteResourceTemplateService.getTemplate(id);

    const remoteResourceFetchFlow$: Observable<typeof complete> =
      this.#generateRemoteResourceFetchFlow(remoteResourceTemplate$, remoteResourceState);

    const reloadControl$ = this.#reloadControlSubject.pipe(filter((reloadId) => reloadId === id));

    const statesSubscriptions$ = remoteResourceTemplate$.pipe(
      filter((rrt) => rrt.status === 'loaded'),
      switchMap((remoteResourceTemplate) => {
        const stateSubscription = remoteResourceTemplate.config.stateSubscription;
        let states$: Observable<unknown> = of(EMPTY);
        if (stateSubscription) {
          states$ = runInInjectionContext(this.environmentInjector, () =>
            getStatesSubscriptionAsContext(stateSubscription)
          );
        }
        return states$;
      })
    );

    combineLatest([reloadControl$.pipe(startWith(true)), statesSubscriptions$])
      .pipe(
        switchMap(() => remoteResourceFetchFlow$),
        takeUntil(
          this.#cancelSubscriptionControlSubject.pipe(filter((canceledId) => canceledId === id))
        )
      )
      .subscribe(() => {
        // since there's always an initial value for state, this will always trigger when we subscribe
        // therefore initialize the fetch data workflow
        logSubscription(`Remote resource ${id} triggered`);
      });
  }

  #generateRemoteResourceFetchFlow(
    remoteResourceTemplateObs: Observable<RemoteResourceTemplateWithStatus>,
    remoteResourceState: BehaviorSubject<RemoteResourceState>
  ): Observable<typeof complete> {
    return remoteResourceTemplateObs.pipe(
      filter((rrt) => rrt.status === 'loaded'),
      tap({
        next: () => this.setLoadingState(remoteResourceState),
      }),
      switchMap((rrt) => this.#processRequest(rrt.config).pipe(map((result) => ({ result, rrt })))),
      switchMap(({ result, rrt }) => {
        console.log('Nam data is: ', result);
        this.setCompleteState(remoteResourceState, result);
        return this.#processHooks({ resourceResult: result, remoteResourceTemplate: rrt });
      }),
      catchError(() => {
        this.setErrorState(remoteResourceState);
        return COMPLETE;
      })
    );
  }

  #interpolateSequencedRequestOptions(args: {
    req: Request;
    accumulatedRequestsResults: unknown[];
    stateSubscriptionConfig?: StateSubscriptionConfig;
  }): Observable<UnknownRecord> {
    const { req, accumulatedRequestsResults, stateSubscriptionConfig } = args;
    const requestConfigInterpolationContext$ = this.getResourceRequestConfigInterpolationContext(
      accumulatedRequestsResults,
      stateSubscriptionConfig
    );

    const interpolatedRequestOptions$ = requestConfigInterpolationContext$.pipe(
      switchMap((ctx) => {
        return this.interpolationService.interpolate({
          value: req.configs,
          context: ctx,
        });
      }),
      catchError((err) => {
        console.warn(`Fail to interpolate request options: ${err}`);
        return err;
      }),
      first()
    );

    return interpolatedRequestOptions$ as Observable<UnknownRecord>;
  }

  #interpolateParallelRequestOptions(
    reqs: Request[],
    stateSubscriptionConfig?: StateSubscriptionConfig
  ): Observable<FetcherIdToConfigMap> {
    const currentState$: Observable<StateMap | null> = stateSubscriptionConfig
      ? runInInjectionContext(this.environmentInjector, () =>
          getStatesSubscriptionAsContext(stateSubscriptionConfig)
        )
      : of(null);
    const requestsConfigs = reqs.map((req) => ({ fetcherId: req.fetcherId, configs: req.configs }));
    const interpolatedRequestOptions$ = currentState$.pipe(
      switchMap((curState) =>
        this.interpolationService.interpolate({
          value: requestsConfigs,
          context: curState ?? {},
        })
      ),
      catchError((err) => {
        console.warn('Fail to interpolate parallel requests options');
        return err;
      })
    );

    return interpolatedRequestOptions$ as Observable<FetcherIdToConfigMap>;
  }

  #interpolateSequencedRequestResult(
    req: Request,
    requestResult: unknown,
    accumulatedRequestsResults: unknown[]
  ): Observable<unknown> {
    const { interpolation } = req;
    if (interpolation) {
      const requestTransformationContext$ =
        this.getResourceRequestTransformationInterpolationContext({
          accumulatedRequestsResults,
          currentRequestResult: requestResult,
        });
      const requestResult$ = requestTransformationContext$.pipe(
        switchMap((ctx) =>
          this.interpolationService.interpolate({
            value: interpolation,
            context: ctx,
          })
        ),
        catchError((err) => {
          console.warn('Failed to interpolate sequenced request result: ', err);
          return err;
        })
      );
      return requestResult$;
    }

    return of(requestResult);
  }

  #interpolateParallelRequestsResult(args: {
    reqs: Request[];
    responses: unknown[];
    stateSubscriptionConfig?: StateSubscriptionConfig;
  }): Observable<unknown[]> {
    const { reqs, responses, stateSubscriptionConfig } = args;
    const results: Observable<unknown>[] = [];
    for (let i = 0; i < reqs.length; i++) {
      const { interpolation } = reqs[i] as Request;
      if (interpolation) {
        const requestTransformationContext$ =
          this.getResourceRequestTransformationInterpolationContext({
            currentRequestResult: responses[i],
            stateSubscriptionConfig,
          });
        const requestResult$ = requestTransformationContext$.pipe(
          switchMap((ctx) =>
            this.interpolationService.interpolate({
              value: interpolation,
              context: ctx,
            })
          ),
          catchError((err) => {
            console.warn('Failed to interpolate parallel request result', err);
            return err;
          }),
          first()
        );
        results.push(requestResult$);
      }
    }

    return forkJoin(results);
  }

  #initializeRemoteResource(id: string): Observable<RemoteResourceState> {
    const newRemoteResourceState = new BehaviorSubject<RemoteResourceState>({
      status: 'init',
      isLoading: true,
      isError: false,
      result: null,
    });

    this.#remoteResourcesStateMap[id] = newRemoteResourceState;

    this.#initializeDataFetchingFlow(id);

    return newRemoteResourceState.asObservable();
  }

  #processHooks(params: {
    resourceResult: unknown;
    remoteResourceTemplate: Extract<RemoteResourceTemplateWithStatus, { status: 'loaded' }>;
  }): Observable<typeof complete> {
    const { resourceResult, remoteResourceTemplate } = params;
    const {
      config: {
        options: { onSuccess: onSuccessHooks },
        stateSubscription,
      },
    } = remoteResourceTemplate;

    if (!onSuccessHooks?.length || resourceResult === notRunResource) {
      return COMPLETE;
    }

    return this.interpolateResourceHooks({
      onSuccessHooks: onSuccessHooks,
      resourceResult,
      stateSubscription,
    }).pipe(
      map((interpolatedHooks) => {
        runInInjectionContext(this.environmentInjector, () => {
          this.#actionHookService.triggerActionHooks(interpolatedHooks);
        });
        return complete;
      })
    );
  }

  #getRunConditon(params: {
    stateSubscription?: StateSubscriptionConfig;
    runCondition: unknown;
  }): Observable<boolean> {
    const { stateSubscription, runCondition } = params;
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    const conditionContext$: Observable<StateMap | {}> = stateSubscription
      ? runInInjectionContext(this.environmentInjector, () =>
          getStatesSubscriptionAsContext(stateSubscription)
        )
      : of({});

    return conditionContext$.pipe(
      switchMap((state) => {
        return this.interpolationService.interpolate({
          value: runCondition,
          context: { state },
        }) as Observable<boolean>;
      }),
      catchError((err) => {
        console.warn('Failed to interpolate resource run condition: ', err);
        return of(false);
      })
    );
  }

  #processRequest(rrt: RemoteResourceTemplate): Observable<unknown | typeof notRunResource> {
    const {
      stateSubscription,
      options: { runCondition = true, requests, parallel },
    } = rrt;

    return this.#getRunConditon({ stateSubscription, runCondition }).pipe(
      switchMap((shouldRunResource) => {
        if (!shouldRunResource) {
          return of(notRunResource);
        }

        const proccessMethod = parallel
          ? this.#processRequestsInParallel(requests, stateSubscription)
          : this.#processRequestsInSequence(requests, stateSubscription);
        return proccessMethod;
      })
    );
  }
}
