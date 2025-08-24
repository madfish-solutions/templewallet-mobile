import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';

import { ActivityInterface } from './activity.interface';
import { TzktTokenTransfer } from './tzkt/token-transfer.interface';

const mockMember = {
  address: 'address2',
  alias: 'alias2'
};

const mockAppliedOperation: ActivityInterface = {
  id: 0,
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
  id: 1,
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
  id: 2,
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

const mockPendingTransfer: TzktTokenTransfer = {
  id: 221390075,
  level: 2330482,
  timestamp: '2022-05-02T11:46:59Z',
  token: {
    id: 85,
    contract: { alias: 'kUSD', address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV' },
    tokenId: '0',
    standard: 'fa1.2',
    metadata: { name: 'Kolibri USD', symbol: 'kUSD', decimals: '18' }
  },
  from: { address: 'tz1VvDQcafAxpAcc2hFWDpSmRYqdEmEhrW1h' },
  to: { alias: 'QuipuSwap kUSD', address: 'KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6' },
  amount: '434827741374364513',
  transactionId: 221390021
};

const mockAppliedTransfer: TzktTokenTransfer = {
  id: 221390075,
  level: 2330482,
  timestamp: '2022-05-02T11:46:59Z',
  token: {
    id: 85,
    contract: { alias: 'kUSD', address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV' },
    tokenId: '0',
    standard: 'fa1.2',
    metadata: { name: 'Kolibri USD', symbol: 'kUSD', decimals: '18' }
  },
  from: { address: 'tz1VvDQcafAxpAcc2hFWDpSmRYqdEmEhrW1h' },
  to: { alias: 'QuipuSwap kUSD', address: 'KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6' },
  amount: '434827741374364513',
  transactionId: 221390021
};

export const mockOperations: Array<ActivityInterface> = [
  mockAppliedOperation,
  mockPendingOperation,
  mockAppliedDelegationOperation
];

export const mockTransfers: Array<TzktTokenTransfer> = [mockPendingTransfer, mockAppliedTransfer];

export const mockActivitiesWithoutMatchedAddress: Array<ActivityInterface> = [
  {
    amount: 'contractBalance',
    destination: {
      address: 'address0',
      alias: 'alias0'
    },
    entrypoint: 'transfer',
    hash: 'hash',
    source: {
      address: 'address1',
      alias: 'alias1'
    },
    id: 2,
    level: undefined,
    status: ActivityStatusEnum.Applied,
    timestamp: 1628380800000,
    type: ActivityTypeEnum.Origination
  }
];

export const mockActivitiesWithMatchedAddress: Array<ActivityInterface> = [
  {
    amount: '-1',
    destination: { address: 'address4', alias: 'alias4' },
    entrypoint: 'transfer',
    hash: 'hash',
    id: 0,
    level: undefined,
    source: { address: 'address1', alias: 'alias1' },
    status: ActivityStatusEnum.Applied,
    timestamp: 1628380800000,
    type: ActivityTypeEnum.Transaction
  },
  {
    amount: '-0',
    destination: { address: 'address7', alias: 'alias7' },
    entrypoint: 'transfer',
    hash: 'hash',
    id: 1,
    level: undefined,
    source: { address: 'address1', alias: 'alias1' },
    status: ActivityStatusEnum.Applied,
    timestamp: 1628380800000,
    type: ActivityTypeEnum.Delegation
  },
  {
    amount: '-contractBalance',
    destination: { address: 'address0', alias: 'alias0' },
    entrypoint: 'transfer',
    hash: 'hash',
    id: 2,
    level: undefined,
    source: { address: 'address1', alias: 'alias1' },
    status: ActivityStatusEnum.Applied,
    timestamp: 1628380800000,
    type: ActivityTypeEnum.Origination
  }
];
