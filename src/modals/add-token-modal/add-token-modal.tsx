import React, { FC } from 'react';

import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';

export const AddTokenModal: FC = () => {
  const { goBack } = useNavigation();
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);

  return (
    <>
      <ModalStatusBar />
      {innerScreenIndex === 0 && (
        <AddTokenAddress onCloseButtonPress={goBack} onFormSubmitted={() => setInnerScreenIndex(1)} />
      )}
      {innerScreenIndex === 1 && (
        <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={goBack} />
      )}
    </>
  );
};
