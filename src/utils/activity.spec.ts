import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { groupActivitiesByHash } from './activity.utils';

describe('activity', () => {
  const mockMember = {
    address: 'address2',
    alias: 'alias2'
  };

  const operations: ActivityInterface[] = [
    {
      type: ActivityTypeEnum.Transaction,
      status: ActivityStatusEnum.Applied,
      hash: 'hash1',
      amount: '0',
      address: 'address1',
      timestamp: 1,
      entrypoint: 'transfer',
      source: mockMember,
      destination: {
        address: 'address1',
        alias: 'alias1'
      }
    },
    {
      type: ActivityTypeEnum.Transaction,
      status: ActivityStatusEnum.Pending,
      hash: 'hash2',
      amount: '1',
      timestamp: 10,
      entrypoint: '',
      source: mockMember,
      destination: {
        address: 'address3',
        alias: 'alias3'
      }
    },
    {
      type: ActivityTypeEnum.Delegation,
      status: ActivityStatusEnum.Applied,
      hash: 'hash3',
      amount: '0',
      timestamp: 6,
      source: mockMember,
      destination: {
        address: 'address3',
        alias: 'alias3'
      }
    }
  ];
  const transfers: ActivityInterface[] = [
    {
      type: ActivityTypeEnum.Transaction,
      status: ActivityStatusEnum.Pending,
      hash: 'hash2',
      amount: '1',
      timestamp: 9,
      entrypoint: '',
      source: mockMember,
      destination: {
        address: 'address4',
        alias: 'alias4'
      }
    },
    {
      type: ActivityTypeEnum.Transaction,
      status: ActivityStatusEnum.Applied,
      hash: 'hash4',
      amount: '0',
      timestamp: 8,
      entrypoint: 'transfer',
      source: {
        address: 'address4',
        alias: 'alias4'
      },
      destination: mockMember
    }
  ];
  const activities = groupActivitiesByHash(operations, transfers);

  it('should sort operations and transfers by timestamp in descending order', () => {
    const flatActivities = activities.flat();
    expect(
      flatActivities.reduce((previousValue, activity, index) => {
        if (index === 0) {
          return true;
        }
        if (!previousValue) {
          return previousValue;
        }

        return activity.timestamp <= flatActivities[index - 1].timestamp;
      }, true)
    ).toEqual(true);
  });

  it('should push operations and transfers with the same hash into one group', () => {
    const result = groupActivitiesByHash(operations, transfers);
    const alreadyMetHashes: string[] = [];
    expect(
      result.reduce((previousValue, group) => {
        if (!previousValue) {
          return previousValue;
        }
        const groupHash = group[0].hash;
        const groupHasSameHashes = group.every(({ hash }) => hash === groupHash);
        const groupIsUnique = !alreadyMetHashes.includes(groupHash);
        alreadyMetHashes.push(groupHash);

        return groupHasSameHashes && groupIsUnique;
      }, true)
    ).toEqual(true);
  });

  it('should keep activities props intact', () => {
    const flatActivities = activities.flat();
    expect(flatActivities.sort((a, b) => b.timestamp - a.timestamp)).toEqual([
      operations[1],
      transfers[0],
      transfers[1],
      operations[2],
      operations[0]
    ]);
  });
});
