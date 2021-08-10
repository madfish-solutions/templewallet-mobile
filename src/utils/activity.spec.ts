import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { groupActivitiesByHash } from './activity.utils';

describe('groupActivitiesByHash', () => {
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

  it('should sort operations and transfers by timestamp in descending order', () => {
    const transfers: ActivityInterface[] = [
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

    expect(groupActivitiesByHash(operations, transfers)).toMatchSnapshot();
  });

  it('should push operations and transfers with the same hash into one group and not mutate activities', () => {
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

    expect(groupActivitiesByHash(operations, transfers)).toMatchSnapshot();
  });
});
