import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  type Provider,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  COMMON_SETUP_CONFIG,
  type ComponentLoadersMap,
  type ComponentsMap,
  type SetupConfigs,
  type TemplatesHandlers,
} from '@dj-ui/common/shared';
import type { Template } from '@dj-ui/core';
import {
  type ActionHookHandlerAndPayloadParserMap,
  ActionHookService,
  DataFetchingService,
  ELEMENT_RENDERER_CONFIG,
  EventsService,
  InterpolationService,
  logWarning,
  RemoteResourceService,
  RemoteResourceTemplateService,
  StateStoreService,
  UIElementFactoryService,
  UIElementTemplateService,
} from '@dj-ui/core';
import { mergeMap, type MonoTypeOperatorFunction, tap } from 'rxjs';

import { DefaultUiElementInfiniteErrorComponentComponent } from './components/default-ui-element-infinite-error-component/default-ui-element-infinite-error-component.component';
import { DefaultUiElementLoadingComponentComponent } from './components/default-ui-element-loading-component/default-ui-element-loading-component.component';
import {
  missingRemoteResourceTemplateEvent,
  missingUIElementTemplateEvent,
} from './events-filters';
import { FileUploadService } from './services/data-fetchers/file-upload.service';
import { HttpFetcherService } from './services/data-fetchers/http-fetcher.service';
import {
  DefaultActionsHooksService,
  ZAddToStateActionHook,
  ZNavigateActionHook,
  ZTriggerRemoteResourceActionHook,
} from './services/defaut-actions-hooks.service';
import { FileService } from './services/file.service';

export const registerDefaultHook = (): void => {
  const defaultActionsHooksService = inject(DefaultActionsHooksService);
  const actionHookService = inject(ActionHookService);

  const actionHookHandlerAndPayloadParserMap: ActionHookHandlerAndPayloadParserMap = {
    addToState: {
      handler: defaultActionsHooksService.handleAddToState,
      actionHookSchema: ZAddToStateActionHook,
    },
    triggerRemoteResource: {
      handler: defaultActionsHooksService.handleTriggerRemoteResource,
      actionHookSchema: ZTriggerRemoteResourceActionHook,
    },
    navigate: {
      handler: defaultActionsHooksService.navigate,
      actionHookSchema: ZNavigateActionHook,
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
  const { getUiElementTemplate, getRemoteResourceTemplate } = params;
  const eventsService = inject(EventsService);
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
      tap((remoteResource) => {
        remoteResourceTemplateService.registerTemplate(remoteResource);
      })
    );

    missingRemoteResources.subscribe();
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

export const provideDJUICommon = (): EnvironmentProviders => {
  const providers: Provider[] = [
    FileUploadService,
    FileService,
    HttpFetcherService,
    DefaultActionsHooksService,
  ];

  return makeEnvironmentProviders(providers);
};

export const provideDefaultDJUIConfig = (): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: ELEMENT_RENDERER_CONFIG,
      useValue: {
        uiElementLoadingComponent: DefaultUiElementLoadingComponentComponent,
        uiElementInfiniteErrorComponent: DefaultUiElementInfiniteErrorComponentComponent,
      },
    },
  ];

  return makeEnvironmentProviders(providers);
};
