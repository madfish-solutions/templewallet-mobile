import React, { FC } from 'react';

import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Disclaimer } from '../../../../components/disclaimer/disclaimer';
import { LoadingPlaceholder } from '../../../../components/loading-placeholder/loading-placeholder';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';

import { useLoadingRequestStyles } from './loading-request.styles';

const texts = [
  '1. go back to your browser;',
  '2. wait for 2 seconds;',
  '3. return back to the Temple Wallet mobile app.'
];

export const LoadingRequest: FC = () => {
  const { goBack } = useNavigation();
  const styles = useLoadingRequestStyles();

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.container}>
        <LoadingPlaceholder text="Operation is loading..." />
        <Disclaimer title="If loading takes too long:" texts={texts} />
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} />
      </ModalButtonsContainer>
    </>
  );
};
