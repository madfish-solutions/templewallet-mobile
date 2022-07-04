import React, { FC } from 'react';

import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { LoadingPlaceholder } from '../../../../components/loading-placeholder/loading-placeholder';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';

export const LoadingRequest: FC = () => {
  const { goBack } = useNavigation();

  return (
    <>
      <ScreenContainer>
        <LoadingPlaceholder text="Operation is loading..." />
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} />
      </ModalButtonsContainer>
    </>
  );
};
