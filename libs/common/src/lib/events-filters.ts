import type { CoreEventObject, EventObject } from '@dj-ui/core';
import { filter, Observable, pipe, type UnaryFunction } from 'rxjs';

export const missingLayoutTemplateEvent = <
  TExtracted extends EventObject = Extract<CoreEventObject, { type: 'MISSING_LAYOUT_TEMPLATE' }>,
>(): UnaryFunction<Observable<EventObject>, Observable<TExtracted>> => {
  return pipe(filter((event): event is TExtracted => event.type === 'MISSING_LAYOUT_TEMPLATE'));
};

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

export const UIElementRepositionEvent = <
  TExtracted extends EventObject = Extract<CoreEventObject, { type: 'UI_ELEMENT_REPOSITION' }>,
>(): UnaryFunction<Observable<EventObject>, Observable<TExtracted>> => {
  return pipe(filter((event): event is TExtracted => event.type === 'UI_ELEMENT_REPOSITION'));
};
