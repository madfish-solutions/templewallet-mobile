import { RouteProp, useRoute } from '@react-navigation/core';
import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ConfirmPayloadType } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { tzToMutez } from '../../utils/tezos.util';
import { useConfirmModalStyles } from './confirm-modal.styles';
import { InternalOperationsConfirm } from './internal-operations-confirm/internal-operations-confirm';

export const ConfirmModal: FC = () => {
  const styles = useConfirmModalStyles();
  const { navigate } = useNavigation();
  const { estimate, send } = useShelter();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Confirm>>();
  const [estimations, setEstimations] = useState<Estimate[]>();
  const [estimationError, setEstimationError] = useState<Error>();

  const handleOperationsSubmit = useCallback(
    (values: { additionalGasFee: BigNumber; additionalStorageFee: BigNumber }) => {
      const { additionalGasFee, additionalStorageFee } = values;
      if (!params) {
        return;
      }
      navigate(ScreensEnum.Wallet);
      if (params.type === ConfirmPayloadType.internalOperations) {
        const { opParams } = params;
        const processedOpParams = opParams.map((op, index) => {
          const { totalCost, storageLimit } = estimations![index];
          const rawAddGasFee = tzToMutez(additionalGasFee, 6);
          const rawAddStorageFee = tzToMutez(additionalStorageFee, 6);

          return {
            ...op,
            fee: new BigNumber(totalCost)
              .plus(rawAddGasFee.div(opParams.length).integerValue())
              .plus(index === opParams.length - 1 ? rawAddGasFee.mod(opParams.length).integerValue() : 0),
            storage_limit: new BigNumber(storageLimit)
              .plus(rawAddStorageFee.div(opParams.length).integerValue())
              .plus(index === opParams.length - 1 ? rawAddStorageFee.mod(opParams.length).integerValue() : 0)
          };
        });
        console.log(JSON.stringify(processedOpParams));
        send({
          from: params.sourcePkh,
          params: processedOpParams.length === 1 ? processedOpParams[0] : processedOpParams
        });
      }
    },
    [params, navigate, send, estimations]
  );

  useEffect(() => {
    if (!params) {
      return;
    }
    (async () => {
      if (params.type === ConfirmPayloadType.internalOperations) {
        const { opParams } = params;
        try {
          const estimations = await estimate({
            from: params.sourcePkh,
            params: opParams.length === 1 ? opParams[0] : opParams
          });
          setEstimations(estimations);
        } catch (e) {
          setEstimationError(e);
        }
      }
    })();
  }, [estimate, params]);

  if (!params) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <Text style={styles.errorMessage}>The confirmation modal can be used only in context of an operation</Text>
      </ScreenContainer>
    );
  }

  if (estimationError) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <Text style={styles.errorMessage}>{estimationError.message}</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!estimations && params.type === ConfirmPayloadType.internalOperations) {
    return (
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <Text style={styles.loadingMessage}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  switch (params.type) {
    case ConfirmPayloadType.internalOperations:
      return <InternalOperationsConfirm params={params} estimations={estimations!} onSubmit={handleOperationsSubmit} />;
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <Text style={styles.errorMessage}>This kind of operations isn't supported yet.</Text>
        </ScreenContainer>
      );
  }
};
