import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';

import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { GasAmountForm } from '../gas-amount-form/gas-amount-form';
import { OperationDetailsView } from './operations-details-view';

type InternalOperationsConfirmProps = {
  isLoading: boolean;
  estimations?: Estimate[];
  params: InternalOperationsPayload;
  onSubmit: (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => void;
};

export const InternalOperationsConfirm: FC<InternalOperationsConfirmProps> = ({
  isLoading,
  estimations,
  params,
  onSubmit
}) => (
  <GasAmountForm isLoading={isLoading} estimations={estimations} onSubmit={onSubmit}>
    <OperationDetailsView opParams={params.opParams} sourcePkh={params.sourcePkh} />
  </GasAmountForm>
);
