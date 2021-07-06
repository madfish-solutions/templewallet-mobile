import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { WalletParamsWithKind } from '@taquito/taquito';

import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';

export type ConfirmationModalParams = InternalOperationsConfirmationModalParams | DAppOperationsConfirmationModalParams;

export interface InternalOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.InternalOperations;
  opParams: WalletParamsWithKind[];
}

export interface DAppOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.DAppOperations;
  message: BeaconRequestOutputMessage;
}
