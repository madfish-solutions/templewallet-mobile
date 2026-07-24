import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { SendAsset } from 'src/modals/send-modal/send-asset.types';

export type ConfirmationModalParams =
  | InternalOperationsConfirmationModalParams
  | DAppOperationsConfirmationModalParams
  | RebalanceConfirmationModalParams
  | EvmTransferConfirmationModalParams;

export interface InternalOperationsConfirmationModalParams extends TestIdProps {
  type: ConfirmationTypeEnum.InternalOperations;
  opParams: ParamsWithKind[];
  disclaimerMessage?: string;
  modalTitle?: string;
  saplingAmount?: string;
  saplingType?: 'shield' | 'unshield' | 'transfer';
}

export interface DAppOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.DAppOperations;
  message: BeaconRequestOutputMessage | null;
  loading?: boolean;
}

interface RebalanceConfirmationModalParams {
  type: ConfirmationTypeEnum.RebalanceOperation;
  opParams?: ParamsWithKind[];
  direction: 'shield' | 'unshield';
  amount: string;
}

export interface EvmTransferConfirmationModalParams {
  type: ConfirmationTypeEnum.EvmTransfer;
  accountId: string;
  asset: SendAsset;
  receiverAddress: HexString;
  atomicAmount: string;
}
