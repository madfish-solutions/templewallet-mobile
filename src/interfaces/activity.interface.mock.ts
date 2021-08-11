import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { groupActivitiesByHash } from '../utils/activity.utils';
import { ActivityGroup, ActivityInterface } from './activity.interface';

const mockMember = {
  address: 'address2',
  alias: 'alias2'
};

const mockAppliedOperation: ActivityInterface = {
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
};

const mockPendingOperation: ActivityInterface = {
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
};

const mockAppliedDelegationOperation: ActivityInterface = {
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
};

const mockPendingTransfer: ActivityInterface = {
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
};

const mockAppliedTransfer: ActivityInterface = {
  type: ActivityTypeEnum.Transaction,
  status: ActivityStatusEnum.Applied,
  hash: 'hash4',
  amount: '0',
  address: 'contractAddress1',
  id: 0,
  timestamp: 8,
  entrypoint: 'transfer',
  source: {
    address: 'address4',
    alias: 'alias4'
  },
  destination: mockMember
};

export const mockOperations: ActivityInterface[] = [
  mockAppliedOperation,
  mockPendingOperation,
  mockAppliedDelegationOperation
];

export const mockTransfers: ActivityInterface[] = [mockPendingTransfer, mockAppliedTransfer];

export const mockAppliedActivityGroups: ActivityGroup[] = groupActivitiesByHash(
  [mockAppliedOperation, mockAppliedDelegationOperation],
  [mockAppliedTransfer]
);
export const mockPendingActivityGroups: ActivityGroup[] = groupActivitiesByHash(
  [mockPendingOperation],
  [mockPendingTransfer]
);
