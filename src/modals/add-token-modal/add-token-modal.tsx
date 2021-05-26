import React, { FC, useState } from 'react';

import { useModalHeader } from '../../components/modal-header/use-modal-header.hook';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';

export const AddTokenModal: FC = () => {
  const { goBack } = useNavigation();
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useModalHeader('Add Token', { current: innerScreenIndex + 1, total: 2 });

  return (
    <>
      {innerScreenIndex === 0 && <AddTokenAddress onFormSubmitted={() => setInnerScreenIndex(1)} />}
      {innerScreenIndex === 1 && (
        <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={goBack} />
      )}
    </>
  );
};
