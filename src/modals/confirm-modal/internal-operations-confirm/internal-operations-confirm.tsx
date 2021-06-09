import { BigNumber } from 'bignumber.js';
import React, { FC, useState, useMemo, useEffect } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { showErrorToast } from '../../../toast/toast.utils';
import { useEstimations } from '../../../utils/estimate.utils';
import { tzToMutez } from '../../../utils/tezos.util';
import { useConfirmModalStyles } from '../confirm-modal.styles';
import { GasAmountForm } from '../gas-amount-form/gas-amount-form';
import { OperationDetailsView } from './operations-details-view';

type InternalOperationsConfirmProps = {
  payload: InternalOperationsPayload;
};

export const InternalOperationsConfirm: FC<InternalOperationsConfirmProps> = ({ payload }) => {
  const { sourcePublicKeyHash, operationsParams } = payload;

  const styles = useConfirmModalStyles();
  const { send } = useShelter();
  const estimationPayload = useMemo(
    () => ({
      from: sourcePublicKeyHash,
      params: operationsParams
    }),
    [sourcePublicKeyHash, operationsParams]
  );
  const { estimationError, estimations } = useEstimations(estimationPayload);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (estimationError) {
      showErrorToast('Warning! The transaction is likely to fail!');
    }
  }, [estimationError]);

  const handleSubmit = (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => {
    const { additionalGasFee, additionalStorageFee } = values;
    setOperationLoading(true);
    const rawAddGasFee = tzToMutez(additionalGasFee, 6);
    const rawAddStorageFee = tzToMutez(additionalStorageFee, 6);
    const rawAddGasFeePerOp = rawAddGasFee.div(operationsParams.length).integerValue();
    const rawAddStorageFeePerOp = rawAddStorageFee.div(operationsParams.length).integerValue();
    const processedOpParams = estimations
      ? operationsParams.map((op, index) => {
          const { totalCost, storageLimit } = estimations[index];

          return {
            ...op,
            fee: new BigNumber(totalCost)
              .plus(rawAddGasFeePerOp)
              .plus(index === operationsParams.length - 1 ? rawAddGasFee.mod(operationsParams.length) : 0),
            storage_limit: new BigNumber(storageLimit)
              .plus(rawAddStorageFeePerOp)
              .plus(index === operationsParams.length - 1 ? rawAddStorageFee.mod(operationsParams.length) : 0)
          };
        })
      : operationsParams;
    send({
      from: sourcePublicKeyHash,
      params: processedOpParams.length === 1 ? processedOpParams[0] : processedOpParams
    });
  };

  if (!estimations && !estimationError) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <Text style={styles.loadingMessage}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <GasAmountForm isLoading={operationLoading} estimations={estimations} onSubmit={handleSubmit}>
      <OperationDetailsView operationsParams={operationsParams} sourcePublicKeyHash={sourcePublicKeyHash} />
    </GasAmountForm>
  );
};
