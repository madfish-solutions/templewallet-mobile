import { BeaconRequestOutputMessage } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';

export type ConfirmationModalParams = InternalOperationsConfirmationModalParams | DAppOperationsConfirmationModalParams;

export interface InternalOperationsConfirmationModalParams extends TestIdProps {
  type: ConfirmationTypeEnum.InternalOperations;
  opParams: ParamsWithKind[];
  disclaimerMessage?: string;
  modalTitle?: string;
}

export interface DAppOperationsConfirmationModalParams {
  type: ConfirmationTypeEnum.DAppOperations;
  message: BeaconRequestOutputMessage | null;
  loading?: boolean;
}
