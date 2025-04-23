import { Injectable } from '@angular/core';
import { asyncScheduler, Observable, observeOn, Subject } from 'rxjs';

export type EventObject = {
  type: string;
  payload?: unknown;
};

export type CoreEventNameToPayLoadMap = {
  GENERIC: never;
  MISSING_LAYOUT_TEMPLATE: {
    id: string;
  };
  MISSING_UI_ELEMENT_TEMPLATE: {
    id: string;
  };
  MISSING_REMOTE_RESOURCE_TEMPLATE: {
    id: string;
  };
};

export type CoreEvent = keyof CoreEventNameToPayLoadMap;

export type CoreEventPayload<T extends CoreEvent> = CoreEventNameToPayLoadMap[T];

export type CoreEventObject = {
  [K in CoreEvent]: CoreEventPayload<K> extends never
    ? {
        type: K;
      }
    : {
        type: K;
        payload: CoreEventPayload<K>;
      };
}[CoreEvent];

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  #events$ = new Subject<EventObject>();

  getEvents(): Observable<EventObject> {
    return this.#events$.asObservable().pipe(observeOn(asyncScheduler));
  }

  emitEvent(event: EventObject): void {
    this.#events$.next(event);
  }
}
