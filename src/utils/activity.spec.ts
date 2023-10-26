import { mockOperations, mockTransfers } from '../interfaces/activity.interface.mock';

import { groupActivitiesByHash } from './activity.utils';

describe('groupActivitiesByHash', () => {
  it('should sort operations and transfers by timestamp in descending order', () => {
    expect(groupActivitiesByHash(mockOperations, [], [], mockTransfers.slice(1))).toMatchSnapshot();
  });

  it('should push operations and transfers with the same hash into one group and not mutate activities', () => {
    expect(groupActivitiesByHash(mockOperations, [], [], mockTransfers)).toMatchSnapshot();
  });
});
