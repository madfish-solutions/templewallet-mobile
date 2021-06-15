import React, { FC, useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';

export const AddTokenModal: FC = () => {
  const { goBack } = useNavigation();
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderProgress current={innerScreenIndex + 1} total={2} />
    },
    [innerScreenIndex]
  );

  return (
    <>
      {innerScreenIndex === 0 && (
        <AddTokenAddress onCloseButtonPress={goBack} onFormSubmitted={() => setInnerScreenIndex(1)} />
      )}
      {innerScreenIndex === 1 && (
        <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={goBack} />
      )}
    </>
  );
};
