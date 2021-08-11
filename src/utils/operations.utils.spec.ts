import {
  mockActivitiesWithMatchedAddress,
  mockActivitiesWithoutMatchedAddress
} from '../interfaces/activity.interface.mock';
import { mockExtractEntrypoint, mockOperations } from '../interfaces/operation.interface.mock';
import { extractEntrypoint, mapOperationsToActivities } from './operation.utils';

describe('mapOperationsToActivities', () => {
  it('map operations to activity, expecting operations array. Using transaction, delegation and origination types in array', () => {
    expect(mapOperationsToActivities('address1', mockOperations)).toEqual(mockActivitiesWithMatchedAddress);
  });

  it('map operations to activity with address, which does not maches with target address', () => {
    expect(mapOperationsToActivities('address12', mockOperations)).toEqual(mockActivitiesWithoutMatchedAddress);
  });
});

describe('extractEntrypoint', () => {
  it('extract entrypoint expecting string', () => {
    expect(extractEntrypoint(JSON.stringify(mockExtractEntrypoint))).toEqual('update_operators');
  });

  it('extract entrypoint with empty string, expecting empty string', () => {
    expect(extractEntrypoint(JSON.stringify(''))).toEqual('');
  });
});
