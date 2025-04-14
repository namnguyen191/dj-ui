import { BehaviorSubject, delay, filter, firstValueFrom, map } from 'rxjs';
import type { UnionToTuple } from 'type-fest';

export type IdbStoresMap = Record<string, unknown>;
export type DbServiceConfigs<TStores extends IdbStoresMap> = {
  stores: UnionToTuple<keyof TStores>;
  dbName: string;
  dbVersion: number;
};

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

export class IdbService<
  TStores extends IdbStoresMap,
  TStoreName extends keyof IdbStoresMap = keyof IdbStoresMap,
> {
  #dbSubject = new BehaviorSubject<DbWithStatus>({
    status: 'idle',
    conn: null,
  });

  db$ = this.#dbSubject.asObservable().pipe(delay(2000));

  constructor(private configs: DbServiceConfigs<TStores>) {
    this.#initDB();
  }

  getRepo<T extends TStoreName>(storeName: T): Promise<IdbRepo<TStores[T]>> {
    return firstValueFrom(
      this.db$.pipe(
        filter((db) => db.conn !== null),
        map((db) => new IdbRepo<TStores[T]>(db.conn, storeName))
      )
    );
  }

  #initDB(): void {
    const currentDbStatus = this.#dbSubject.getValue();

    if (currentDbStatus.status === 'ready' || currentDbStatus.status === 'initializing') {
      return;
    }

    const req = indexedDB.open(this.configs.dbName, this.configs.dbVersion);

    req.onupgradeneeded = (e): void => {
      const db = (e.target as IDBOpenDBRequest).result;
      for (const storeName of this.configs.stores as TStoreName[]) {
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

  deleteOne(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const trans = this.#conn.transaction(this.#storeName, 'readwrite');
      const store = trans.objectStore(this.#storeName);
      const req: IDBRequest<undefined> = store.delete(id);

      req.onsuccess = (): void => {
        if (req.result === undefined) {
          resolve();
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
