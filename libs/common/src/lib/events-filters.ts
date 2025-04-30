import type { CoreEventObject, EventObject } from '@dj-ui/core';
import { filter, Observable, pipe, type UnaryFunction } from 'rxjs';

export const missingRemoteResourceTemplateEvent = <
  TExtracted extends EventObject = Extract<
    CoreEventObject,
    { type: 'MISSING_REMOTE_RESOURCE_TEMPLATE' }
  >,
>(): UnaryFunction<Observable<EventObject>, Observable<TExtracted>> => {
  return pipe(
    filter((event): event is TExtracted => event.type === 'MISSING_REMOTE_RESOURCE_TEMPLATE')
  );
};

export const missingUIElementTemplateEvent = <
  TExtracted extends EventObject = Extract<
    CoreEventObject,
    { type: 'MISSING_UI_ELEMENT_TEMPLATE' }
  >,
>(): UnaryFunction<Observable<EventObject>, Observable<TExtracted>> => {
  return pipe(filter((event): event is TExtracted => event.type === 'MISSING_UI_ELEMENT_TEMPLATE'));
};
