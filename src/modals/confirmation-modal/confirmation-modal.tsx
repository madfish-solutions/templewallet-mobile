import { RouteProp, useRoute } from '@react-navigation/core';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useConfirmModalStyles } from './confirmation-modal.styles';
import { InternalOperationsConfirmation } from './internal-operations-confirmation/internal-operations-confirmation';

export const ConfirmationModal: FC = () => {
  const styles = useConfirmModalStyles();
  const { type, sender, opParams } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Confirmation>>().params;

  switch (type) {
    case ConfirmationTypeEnum.InternalOperations:
      return <InternalOperationsConfirmation sender={sender} opParams={opParams} />;
    default:
      return (
        <ScreenContainer isFullScreenMode={true}>
          <Text style={styles.errorMessage}>This kind of operations isn't supported yet.</Text>
        </ScreenContainer>
      );
  }
};
