import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActionHookHandlerAndPayloadParserMap,
  ActionHookService,
  BaseUIElementComponent,
  DataFetchingService,
  EventsService,
  InterpolationService,
  LayoutTemplate,
  LayoutTemplateService,
  logWarning,
  RemoteResourceService,
  RemoteResourceTemplate,
  RemoteResourceTemplateService,
  StateStoreService,
  UIElementFactoryService,
  UIElementLoader,
  UIElementPositionAndSize,
  UIElementTemplate,
  UIElementTemplateService,
} from '@dj-ui/core';
import { Template } from '@dj-ui/core';
import { set } from 'lodash-es';
import {
  buffer,
  debounceTime,
  forkJoin,
  map,
  mergeMap,
  MonoTypeOperatorFunction,
  Observable,
  tap,
} from 'rxjs';

import { FileUploadService } from './data-fetchers/file-upload.service';
import { HttpFetcherService } from './data-fetchers/http-fetcher.service';
import {
  DefaultActionsHooksService,
  ZAddToStateActionHookPayload,
  ZNavigateHookPayload,
  ZTriggerRemoteResourceHookPayload,
} from './defaut-actions-hooks.service';
import {
  missingLayoutTemplateEvent,
  missingRemoteResourceTemplateEvent,
  missingUIElementTemplateEvent,
  UIElementRepositionEvent,
} from './events-filters';

export type TemplatesHandlers = {
  getLayoutTemplate?: (id: string) => Observable<LayoutTemplate>;
  getUiElementTemplate?: (id: string) => Observable<UIElementTemplate>;
  getRemoteResourceTemplate?: (id: string) => Observable<RemoteResourceTemplate>;
  updateElementsPositionsHandler?: (
    layoutId: string,
    eleWithNewPosAndSize: { [id: string]: UIElementPositionAndSize }
  ) => Observable<void>;
};
export type ComponentsMap = { [componentType: string]: Type<BaseUIElementComponent> };
export type ComponentLoadersMap = { [componentType: string]: UIElementLoader };
export type SetupConfigs = {
  templatesHandlers?: TemplatesHandlers;
  componentsMap?: ComponentsMap;
  componentLoadersMap?: ComponentLoadersMap;
};
export const COMMON_SETUP_CONFIG = new InjectionToken<SetupConfigs>('COMMON_SETUP_CONFIG');

export const registerDefaultHook = (): void => {
  const defaultActionsHooksService = inject(DefaultActionsHooksService);
  const actionHookService = inject(ActionHookService);

  const actionHookHandlerAndPayloadParserMap: ActionHookHandlerAndPayloadParserMap = {
    addToState: {
      handler: defaultActionsHooksService.handleAddToState,
      payloadParser: ZAddToStateActionHookPayload,
    },
    triggerRemoteResource: {
      handler: defaultActionsHooksService.handleTriggerRemoteResource,
      payloadParser: ZTriggerRemoteResourceHookPayload,
    },
    navigate: {
      handler: defaultActionsHooksService.navigate,
      payloadParser: ZNavigateHookPayload,
    },
  };

  actionHookService.registerHooks(actionHookHandlerAndPayloadParserMap);
};

export const registerSimpleHttpDataFetcher = (): void => {
  const httpFetcher = inject(HttpFetcherService).httpFetcher;
  const dataFetchingService = inject(DataFetchingService);

  dataFetchingService.registerFetcher('httpFetcher', httpFetcher);
};

export const registerSingleFileUploadDataFetcher = (): void => {
  const singleFileUploadFetcher = inject(FileUploadService).singleFileUploadFetcher;
  const dataFetchingService = inject(DataFetchingService);

  dataFetchingService.registerFetcher('singleFileUploadFetcher', singleFileUploadFetcher);
};

export const setupEventsListener = (params: TemplatesHandlers): void => {
  const {
    getLayoutTemplate,
    getUiElementTemplate,
    getRemoteResourceTemplate,
    updateElementsPositionsHandler,
  } = params;
  const eventsService = inject(EventsService);
  const layoutTemplateService = inject(LayoutTemplateService);
  const uiElementTemplatesService = inject(UIElementTemplateService);
  const remoteResourceTemplateService = inject(RemoteResourceTemplateService);

  const allEvents = eventsService.getEvents().pipe(takeUntilDestroyed());

  const warnMismatchTemplateId = <T extends Template>(
    requestedId: string
  ): MonoTypeOperatorFunction<T> => {
    return tap({
      next: (template) => {
        if (template.id !== requestedId) {
          console.warn(
            `Request for template with id ${requestedId} but received ${template.id} instead. This might cause DJ-UI to register the wrong template, leading to missing UI. Please check your template configuration for mis-matching id`
          );
        }
      },
    });
  };

  if (getLayoutTemplate) {
    const missingLayoutEvents = allEvents.pipe(
      missingLayoutTemplateEvent(),
      mergeMap((event) => {
        const missingLayoutId = event.payload.id;
        layoutTemplateService.startRegisteringTemplate(missingLayoutId);
        return getLayoutTemplate(missingLayoutId).pipe(warnMismatchTemplateId(missingLayoutId));
      }),
      tap((layout) => layoutTemplateService.registerTemplate(layout))
    );

    missingLayoutEvents.subscribe();
  }

  if (getUiElementTemplate) {
    const missingUIElementTemplates = allEvents.pipe(
      missingUIElementTemplateEvent(),
      mergeMap((event) => {
        const missingUIElementTemplateId = event.payload.id;
        uiElementTemplatesService.startRegisteringTemplate(missingUIElementTemplateId);
        return getUiElementTemplate(missingUIElementTemplateId).pipe(
          warnMismatchTemplateId(missingUIElementTemplateId)
        );
      }),
      tap((uiElementTemplate) => {
        uiElementTemplatesService.registerTemplate(uiElementTemplate);
      })
    );
    missingUIElementTemplates.subscribe();
  }

  if (getRemoteResourceTemplate) {
    const missingRemoteResources = allEvents.pipe(
      missingRemoteResourceTemplateEvent(),
      mergeMap((event) => {
        const missingRemoteResourceId = event.payload.id;
        remoteResourceTemplateService.startRegisteringTemplate(missingRemoteResourceId);
        return getRemoteResourceTemplate(missingRemoteResourceId).pipe(
          warnMismatchTemplateId(missingRemoteResourceId)
        );
      }),
      tap((remoteResource) => remoteResourceTemplateService.registerTemplate(remoteResource))
    );

    missingRemoteResources.subscribe();
  }

  if (updateElementsPositionsHandler) {
    const uiElementReposition = allEvents.pipe(UIElementRepositionEvent());

    const buffTrigger = uiElementReposition.pipe(debounceTime(3000));

    const updateElementPosition = uiElementReposition.pipe(
      buffer(buffTrigger),
      map((events) =>
        events.reduce<{ [layoutId: string]: { [eleId: string]: UIElementPositionAndSize } }>(
          (acc, cur) => {
            const {
              payload: { elementId, layoutId, newPositionAndSize },
            } = cur;
            acc = set(acc, `${layoutId}.${elementId}`, newPositionAndSize);
            return acc;
          },
          {}
        )
      ),
      mergeMap((val) => {
        const updateLayoutRequests = Object.entries(val).map(([layoutId, eleWithNewPosAndSize]) =>
          updateElementsPositionsHandler(layoutId, eleWithNewPosAndSize)
        );
        return forkJoin(updateLayoutRequests);
      })
    );

    updateElementPosition.subscribe();
  }
};

export const registerComponents = (componentsMaps: ComponentsMap): void => {
  const uiElementFactoryService = inject(UIElementFactoryService);

  for (const [componentType, componentClass] of Object.entries(componentsMaps)) {
    uiElementFactoryService.registerUIElement({
      type: componentType,
      component: componentClass,
    });
  }
};

export const registerComponentLoaders = (componentLoadersMap: ComponentLoadersMap): void => {
  const uiElementFactoryService = inject(UIElementFactoryService);

  for (const [componentType, loader] of Object.entries(componentLoadersMap)) {
    uiElementFactoryService.registerUIElementLoader({
      type: componentType,
      loader,
    });
  }
};

export const setupDefault = (): void => {
  let configs: SetupConfigs;
  try {
    configs = inject(COMMON_SETUP_CONFIG);
  } catch (_error) {
    logWarning(
      'No configs was provided for DJ-UI default setup, please provide values for the COMMON_SETUP_CONFIG token'
    );
    return;
  }

  registerDefaultHook();
  registerSimpleHttpDataFetcher();

  const { templatesHandlers, componentsMap, componentLoadersMap } = configs;

  if (templatesHandlers) {
    setupEventsListener(templatesHandlers);
  }

  if (componentsMap) {
    registerComponents(componentsMap);
  }

  if (componentLoadersMap) {
    registerComponentLoaders(componentLoadersMap);
  }
};

export const provideDJUI = (): EnvironmentProviders => {
  const providers: Provider[] = [
    LayoutTemplateService,
    UIElementTemplateService,
    RemoteResourceTemplateService,
    EventsService,
    DataFetchingService,
    InterpolationService,
    RemoteResourceService,
    StateStoreService,
    UIElementFactoryService,
    ActionHookService,
  ];

  return makeEnvironmentProviders(providers);
};
