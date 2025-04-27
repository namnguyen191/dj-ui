import { IdbService } from './idb.service';

const mockIdb = {
  open: vitest.fn().mockReturnValue({}),
};

global.indexedDB = mockIdb as unknown as IDBFactory;

describe('IdbService', () => {
  it('should be able to create an instance of the class', () => {
    const service = new IdbService({
      stores: ['test'],
      dbName: 'mock-db',
      dbVersion: 1,
    });

    expect(service).toBeTruthy();
  });
});
