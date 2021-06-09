import { RouteProp, useRoute } from '@react-navigation/core';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ConfirmPayloadTypeEnum } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useConfirmModalStyles } from './confirm-modal.styles';
import { InternalOperationsConfirm } from './internal-operations-confirm/internal-operations-confirm';

export const ConfirmModal: FC = () => {
  const styles = useConfirmModalStyles();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Confirm>>();

  switch (params.type) {
    case ConfirmPayloadTypeEnum.internalOperations:
      return <InternalOperationsConfirm payload={params} />;
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <Text style={styles.errorMessage}>This kind of operations isn't supported yet.</Text>
        </ScreenContainer>
      );
  }
};
