import React, { FC } from 'react';

import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Disclaimer } from '../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../components/divider/divider';
import { LoadingPlaceholder } from '../../../../components/loading-placeholder/loading-placeholder';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../../styles/format-size';

const texts = [
  '1. go back to your browser;',
  '2. wait for 2 seconds;',
  '3. return back to the Temple Wallet mobile app.'
];

export const LoadingRequest: FC = () => {
  const { goBack } = useNavigation();

  return (
    <>
      <ScreenContainer>
        <Divider size={formatSize(16)} />
        <Disclaimer title="Attention! If loading takes too long:" texts={texts} />
        <LoadingPlaceholder text="Operation is loading..." />
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Close" onPress={goBack} />
      </ModalButtonsContainer>
    </>
  );
};
