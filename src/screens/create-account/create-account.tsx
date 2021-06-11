import React, { useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { CreateNewWallet } from './create-new-wallet/create-new-wallet';

export const CreateAccount = () => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useNavigationSetOptions(
    {
      headerRight: () => <HeaderProgress current={innerScreenIndex + 1} total={2} />
    },
    [innerScreenIndex]
  );

  return (
    <>
      {innerScreenIndex === 0 && <CreateNewWallet onFormSubmitted={() => setInnerScreenIndex(1)} />}
      {innerScreenIndex === 1 && <CreateNewPassword onGoBackPress={() => setInnerScreenIndex(0)} />}
    </>
  );
};
