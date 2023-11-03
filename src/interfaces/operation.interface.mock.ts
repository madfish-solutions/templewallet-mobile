import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';

import { OperationInterface } from './operation.interface';

const mockMember = {
  address: 'address1',
  alias: 'alias1'
};

const mockTarget = {
  address: 'address4',
  alias: 'alias4'
};

export const mockOperations: Array<OperationInterface> = [
  {
    id: 0,
    entrypoint: 'transfer',
    type: ActivityTypeEnum.Transaction,
    status: ActivityStatusEnum.Applied,
    hash: 'hash',
    block: 'block',
    amount: 1,
    timestamp: new Date(2021, 7, 8, 0, 0, 0).toISOString(),
    hasInternals: true,
    contractBalance: 'contractBalance',
    sender: mockMember,
    target: mockTarget,
    newDelegate: {
      address: 'address5',
      alias: 'alias5'
    },
    originatedContract: {
      address: 'address6',
      alias: 'alias6'
    }
  },
  {
    id: 1,
    entrypoint: 'transfer',
    type: ActivityTypeEnum.Delegation,
    status: ActivityStatusEnum.Applied,
    hash: 'hash',
    block: 'block',
    amount: 1,
    timestamp: new Date(2021, 7, 8, 0, 0, 0).toISOString(),
    hasInternals: true,
    contractBalance: 'contractBalance',
    sender: mockMember,
    target: mockTarget,
    newDelegate: {
      address: 'address7',
      alias: 'alias7'
    },
    originatedContract: {
      address: 'address8',
      alias: 'alias8'
    }
  },
  {
    id: 2,
    entrypoint: 'transfer',
    type: ActivityTypeEnum.Origination,
    status: ActivityStatusEnum.Applied,
    hash: 'hash',
    block: 'block',
    amount: 1,
    timestamp: new Date(2021, 7, 8, 0, 0, 0).toISOString(),
    hasInternals: true,
    contractBalance: 'contractBalance',
    sender: mockMember,
    target: {
      address: 'address4',
      alias: 'alias4'
    },
    newDelegate: {
      address: 'address9',
      alias: 'alias9'
    },
    originatedContract: {
      address: 'address0',
      alias: 'alias0'
    }
  }
];
