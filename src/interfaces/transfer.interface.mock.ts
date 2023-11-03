import { ActivityStatusEnum } from '../enums/activity-status.enum';

import { TransferInterface } from './transfer.interface';

export const mockSenderAddress = 'mockSenderAddress';
export const mockReceiverAddress = 'mockReceiverAddress';

export const mockAppliedTransfer: TransferInterface = {
  contract: 'mockContractAddress',
  token_id: 777,
  status: ActivityStatusEnum.Applied,
  amount: '100',
  hash: 'mockTransferHash',
  timestamp: 'mockTransferTimestamp',
  from: mockSenderAddress,
  to: mockReceiverAddress,
  alias: 'mockAlias'
};
