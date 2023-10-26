import { TransferInterface } from '../interfaces/transfer.interface';
import { mockAppliedTransfer, mockReceiverAddress, mockSenderAddress } from '../interfaces/transfer.interface.mock';

import { mapTransfersToActivities } from './transfer.utils';

describe('mapTransfersToActivities', () => {
  it('should set contract address & alias as source if there is no sender', () => {
    const mockAppliedTransferWithoutSender: TransferInterface = {
      ...mockAppliedTransfer,
      from: ''
    };

    const result = mapTransfersToActivities(mockReceiverAddress, [mockAppliedTransferWithoutSender]);

    expect(result[0].source.address).toEqual(mockAppliedTransferWithoutSender.contract);
    expect(result[0].source.alias).toEqual(mockAppliedTransferWithoutSender.alias);
  });
  it('should set 0 as default token id', () => {
    const mockAppliedTransferWithoutTokenId: TransferInterface = {
      ...mockAppliedTransfer,
      token_id: undefined
    };

    expect(mapTransfersToActivities(mockReceiverAddress, [mockAppliedTransfer])[0].id).toEqual(
      mockAppliedTransfer.token_id
    );
    expect(mapTransfersToActivities(mockReceiverAddress, [mockAppliedTransferWithoutTokenId])[0].id).toEqual(0);
  });
  it('should correctly map sent amount sign for sender & receiver', () => {
    expect(mapTransfersToActivities(mockReceiverAddress, [mockAppliedTransfer])[0].amount).toEqual(
      mockAppliedTransfer.amount
    );
    expect(mapTransfersToActivities(mockSenderAddress, [mockAppliedTransfer])[0].amount).toEqual(
      `-${mockAppliedTransfer.amount}`
    );
  });
});
