import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { WalletParamsWithKind } from '@taquito/taquito';

import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export type ConfirmationModalParams = InternalOperationsConfirmationModalParams | DAppOperationsConfirmationModalParams;

export interface InternalOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.InternalOperations;
  sender: WalletAccountInterface;
  opParams: WalletParamsWithKind[];
}

export interface DAppOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.DAppOperations;
  message: BeaconRequestOutputMessage;
}
