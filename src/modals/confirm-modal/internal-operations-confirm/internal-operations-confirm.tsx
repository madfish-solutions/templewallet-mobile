import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';

import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { GasAmountForm } from '../gas-amount-form/gas-amount-form';
import { OperationDetailsView } from './operations-details-view';

type InternalOperationsConfirmProps = {
  buttonsDisabled: boolean;
  estimations?: Estimate[];
  params: InternalOperationsPayload;
  onSubmit: (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => void;
};

export const InternalOperationsConfirm: FC<InternalOperationsConfirmProps> = ({
  buttonsDisabled,
  estimations,
  params,
  onSubmit
}) => (
  <GasAmountForm buttonsDisabled={buttonsDisabled} estimations={estimations} onSubmit={onSubmit}>
    <OperationDetailsView opParams={params.opParams} sourcePkh={params.sourcePkh} />
  </GasAmountForm>
);
