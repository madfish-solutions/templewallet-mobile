import React, { FC, useState } from 'react';

import { useNavigation } from '../../navigator/use-navigation.hook';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';

export const AddTokenModal: FC = () => {
  const { goBack } = useNavigation();
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  return (
    <>
      {innerScreenIndex === 0 && <AddTokenAddress onFormSubmitted={() => setInnerScreenIndex(1)} />}
      {innerScreenIndex === 1 && (
        <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={goBack} />
      )}
    </>
  );
};
