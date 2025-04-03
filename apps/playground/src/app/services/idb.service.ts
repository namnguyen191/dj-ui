import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, filter, firstValueFrom, map } from 'rxjs';

import type {
  AppLayoutTemplate,
  AppRemoteResourceTemplate,
  AppUIElementTemplate,
} from '../shared/dj-ui-app-template';

export const DB_NAME = 'DJ_UI_LOCAL_DB';
export const DB_VERSION = 2;
export type IdbStoresMap = {
  uiElementTemplates: AppUIElementTemplate;
  layoutTemplates: AppLayoutTemplate;
  remoteResourceTemplates: AppRemoteResourceTemplate;
};
export type IdbStoreName = keyof IdbStoresMap;
export const ALL_STORES: IdbStoreName[] = [
  'layoutTemplates',
  'uiElementTemplates',
  'remoteResourceTemplates',
];

export type InitDbParams = { storeName: string; objectIdPath: string };

export type DbWithStatus =
  | {
      status: 'idle' | 'initializing' | 'error';
      conn: null;
    }
  | {
      status: 'ready';
      conn: IDBDatabase;
    };

@Injectable({
  providedIn: 'root',
})
export class IdbService {
  #dbSubject = new BehaviorSubject<DbWithStatus>({
    status: 'idle',
    conn: null,
  });

  db$ = this.#dbSubject.asObservable().pipe(delay(2000));

  constructor() {
    this.#initDB();
  }

  getRepo<T extends IdbStoreName>(storeName: T): Promise<IdbRepo<IdbStoresMap[T]>> {
    return firstValueFrom(
      this.db$.pipe(
        filter((db) => db.conn !== null),
        map((db) => new IdbRepo<IdbStoresMap[T]>(db.conn, storeName))
      )
    );
  }

  #initDB(): void {
    const currentDbStatus = this.#dbSubject.getValue();

    if (currentDbStatus.status === 'ready' || currentDbStatus.status === 'initializing') {
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e): void => {
      const db = (e.target as IDBOpenDBRequest).result;
      for (const storeName of ALL_STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: false,
          });
        }
      }
    };

    req.onsuccess = (): void => {
      this.#dbSubject.next({
        status: 'ready',
        conn: req.result,
      });
    };

    req.onerror = (): void => {
      this.#dbSubject.next({
        status: 'error',
        conn: null,
      });
    };
  }
}

export class IdbRepo<T> {
  readonly #conn: IDBDatabase;
  readonly #storeName: string;

  constructor(conn: IDBDatabase, storeName: string) {
    this.#conn = conn;
    this.#storeName = storeName;
  }

  getAll = (): Promise<T[]> => {
    return new Promise<T[]>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readonly');
      const store = trans.objectStore(this.#storeName);
      const req: IDBRequest<T[]> = store.getAll() as IDBRequest<T[]>;

      req.onsuccess = (): void => {
        resolve(req.result);
      };
      req.onerror = (): void => {
        reject(req.error);
      };
    });
  };

  createOne = (object: T): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readwrite');
      const store = trans.objectStore(this.#storeName);
      const req = store.add(object);

      req.onsuccess = (): void => {
        resolve(object);
      };
      req.onerror = (): void => {
        reject(req.error);
      };
    });
  };

  updateOne = (updatedObject: T): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readwrite');
      const store = trans.objectStore(this.#storeName);
      const req = store.put(updatedObject);

      req.onsuccess = (): void => {
        resolve(updatedObject);
      };
      req.onerror = (): void => {
        reject(req.error);
      };
    });
  };

  getOne(id: string): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readonly');
      const store = trans.objectStore(this.#storeName);
      const req: IDBRequest<T> = store.get(id) as IDBRequest<T>;

      req.onsuccess = (): void => {
        if (req.result === undefined) {
          resolve(null);
          return;
        }

        resolve(req.result);
      };
      req.onerror = (): void => {
        reject(req.error);
      };
    });
  }

  clearAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readwrite');
      const store = trans.objectStore(this.#storeName);
      const req: IDBRequest = store.clear();

      req.onsuccess = (): void => {
        if (req.result === undefined) {
          resolve();
          return;
        }

        reject(req.result);
      };
      req.onerror = (): void => {
        reject(req.error);
      };
    });
  }
}
