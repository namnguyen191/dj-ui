import { untracked } from '@angular/core';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import type { EntityId } from '@ngrx/signals/entities';
import { removeEntity, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import type { UnknownRecord } from 'type-fest';

import { setError, setFulfilled, setPending, withRequestStatus } from './request-status.store-feat';

export type EntityLike = UnknownRecord & {
  id: EntityId;
};

type LoaderFunc<TEntity extends EntityLike, TCreatePayload, TUpdatePayload> = {
  fetch: (id: TEntity['id']) => Promise<TEntity>;
  fetchAll: () => Promise<TEntity[]>;
  create: (createPayload: TCreatePayload) => Promise<TEntity>;
  update: (updatePayload: TUpdatePayload) => Promise<TEntity>;
  delete: (id: TEntity['id']) => Promise<void>;
};
type EntityMethod<TEntity extends EntityLike, TCreatePayload, TUpdatePayload> = {
  get: (id: TEntity['id']) => Promise<TEntity>;
  loadAll: () => Promise<TEntity[]>;
  add: (createPayload: TCreatePayload) => Promise<TEntity>;
  change: (updatePayload: TUpdatePayload) => Promise<TEntity>;
  delete: (id: TEntity['id']) => Promise<void>;
};

export const withEntitiesAndLoaders = <TEntity extends EntityLike, TCreatePayload, TUpdatePayload>(
  params: () => Partial<LoaderFunc<TEntity, TCreatePayload, TUpdatePayload>>
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  return signalStoreFeature(
    withEntities<TEntity>(),
    withRequestStatus(),
    withMethods((store) => {
      const loader = params();
      const methods: EntityMethod<TEntity, TCreatePayload, TUpdatePayload> = {
        loadAll: async () => {
          if (!loader.fetchAll) {
            throw Error('fetchAll loader was not provided');
          }
          patchState(store, setPending());
          try {
            const allEntities = await loader.fetchAll();
            patchState(store, setAllEntities(allEntities), setFulfilled());

            return allEntities;
          } catch (error) {
            setError('Something went wrong fetching all entities');
            throw error;
          }
        },
        get: async (id) => {
          const allEntities = untracked(store.entities);
          const existingEntity = allEntities.find((ent) => ent.id === id);
          if (existingEntity) {
            return existingEntity;
          }
          if (!loader.fetch) {
            throw Error('fetch loader was not provided');
          }
          patchState(store, setPending());
          try {
            const fetchedEntity = await loader.fetch(id);
            patchState(store, setEntity(fetchedEntity), setFulfilled());
            return fetchedEntity;
          } catch (error) {
            const errMsg = `Something went wrong fetching entity with id ${id}. Err: ${error}`;
            setError(errMsg);
            patchState(store, setFulfilled());
            throw Error(errMsg);
          }
        },
        add: async (createPayload) => {
          if (!loader.create) {
            throw Error('create loader was not provided');
          }
          patchState(store, setPending());
          try {
            const createdEntity = await loader.create(createPayload);
            patchState(store, setEntity(createdEntity), setFulfilled());
            return createdEntity;
          } catch (error) {
            setError('Something went wrong creating entity');
            throw error;
          }
        },
        change: async (updatePayload) => {
          if (!loader.update) {
            throw Error('update loader was not provided');
          }
          patchState(store, setPending());
          try {
            const updatedEntity = await loader.update(updatePayload);
            patchState(store, setEntity(updatedEntity), setFulfilled());
            return updatedEntity;
          } catch (error) {
            setError('Something went wrong updating entity');
            throw error;
          }
        },
        delete: async (id) => {
          if (!loader.delete) {
            throw Error('delete loader was not provided');
          }
          patchState(store, setPending());
          try {
            await loader.delete(id);
            patchState(store, removeEntity(id), setFulfilled());
          } catch (error) {
            setError(`Something went wrong deleting entity with id ${id}`);
            throw error;
          }
        },
      };

      return methods;
    })
  );
};
