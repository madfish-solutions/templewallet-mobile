import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';

import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ParamsWithKind } from '../../interfaces/op-params.interface';

export type ConfirmationModalParams = InternalOperationsConfirmationModalParams | DAppOperationsConfirmationModalParams;

export interface InternalOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.InternalOperations;
  opParams: ParamsWithKind[];
}

export interface DAppOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.DAppOperations;
  message: BeaconRequestOutputMessage;
}
