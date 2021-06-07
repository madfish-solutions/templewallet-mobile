import { RouteProp, useRoute } from '@react-navigation/core';
import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ConfirmPayloadTypeEnum } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useHdAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast } from '../../toast/toast.utils';
import { estimate } from '../../utils/estimate.util';
import { tzToMutez } from '../../utils/tezos.util';
import { useConfirmModalStyles } from './confirm-modal.styles';
import { InternalOperationsConfirm } from './internal-operations-confirm/internal-operations-confirm';

export const ConfirmModal: FC = () => {
  const styles = useConfirmModalStyles();
  const { send } = useShelter();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Confirm>>();
  const accounts = useHdAccountsListSelector();
  const [estimations, setEstimations] = useState<Estimate[]>();
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [estimationError, setEstimationError] = useState<Error>();

  const handleOperationsSubmit = (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => {
    const { additionalGasFee, additionalStorageFee } = values;
    if (!params) {
      return;
    }
    if (params.type === ConfirmPayloadTypeEnum.internalOperations) {
      setButtonsDisabled(true);
      const { opParams } = params;
      const rawAddGasFee = tzToMutez(additionalGasFee, 6);
      const rawAddStorageFee = tzToMutez(additionalStorageFee, 6);
      const rawAddGasFeePerOp = rawAddGasFee.div(opParams.length).integerValue();
      const rawAddStorageFeePerOp = rawAddStorageFee.div(opParams.length).integerValue();
      const processedOpParams = estimations
        ? opParams.map((op, index) => {
            const { totalCost, storageLimit } = estimations[index];

            return {
              ...op,
              fee: new BigNumber(totalCost)
                .plus(rawAddGasFeePerOp)
                .plus(index === opParams.length - 1 ? rawAddGasFee.mod(opParams.length) : 0),
              storage_limit: new BigNumber(storageLimit)
                .plus(rawAddStorageFeePerOp)
                .plus(index === opParams.length - 1 ? rawAddStorageFee.mod(opParams.length) : 0)
            };
          })
        : opParams;
      send({
        from: params.sourcePkh,
        params: processedOpParams.length === 1 ? processedOpParams[0] : processedOpParams
      });
    }
  };

  useEffect(() => {
    if (!params) {
      return;
    }
    (async () => {
      if (params.type === ConfirmPayloadTypeEnum.internalOperations) {
        const { opParams } = params;
        const publicKey = accounts.find(({ publicKeyHash }) => publicKeyHash === params.sourcePkh)?.publicKey;
        try {
          if (!publicKey) {
            throw new Error('Failed to get public key of the source account');
          }
          const estimations = await estimate(
            {
              from: params.sourcePkh,
              params: opParams.length === 1 ? opParams[0] : opParams
            },
            publicKey,
            params.sourcePkh
          );
          setEstimations(estimations);
        } catch (e) {
          showErrorToast('Warning! The transaction is likely to fail!');
          setEstimationError(e);
        }
      }
    })();
  }, [params, accounts]);

  if (!params) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <Text style={styles.errorMessage}>The confirmation modal can be used only in context of an operation</Text>
      </ScreenContainer>
    );
  }

  if (!estimations && !estimationError && params.type === ConfirmPayloadTypeEnum.internalOperations) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <Text style={styles.loadingMessage}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  switch (params.type) {
    case ConfirmPayloadTypeEnum.internalOperations:
      return (
        <InternalOperationsConfirm
          params={params}
          estimations={estimations}
          onSubmit={handleOperationsSubmit}
          isLoading={buttonsDisabled}
        />
      );
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <Text style={styles.errorMessage}>This kind of operations isn't supported yet.</Text>
        </ScreenContainer>
      );
  }
};
