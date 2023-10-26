import {
  mockActivitiesWithMatchedAddress,
  mockActivitiesWithoutMatchedAddress
} from '../interfaces/activity.interface.mock';
import { mockOperations } from '../interfaces/operation.interface.mock';

import { mapOperationsToActivities } from './operation.utils';

describe('mapOperationsToActivities', () => {
  it('map operations to activity, expecting operations array. Using transaction, delegation and origination types in array', () => {
    expect(mapOperationsToActivities('address1', mockOperations)).toEqual(mockActivitiesWithMatchedAddress);
  });

  it('map operations to activity with address, which does not maches with target address', () => {
    expect(mapOperationsToActivities('address12', mockOperations)).toEqual(mockActivitiesWithoutMatchedAddress);
  });

  it('map operations to activity with empty address', () => {
    expect(mapOperationsToActivities('', mockOperations)).toEqual(mockActivitiesWithoutMatchedAddress);
  });
});
