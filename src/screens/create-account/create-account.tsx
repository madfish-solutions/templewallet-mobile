import React, { useEffect, useState } from 'react';

import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { generateSeed } from '../../utils/keys.util';
import { CreateNewPassword } from './create-new-password/create-new-password';

export const CreateAccount = () => {
  const [seedPhrase, setSeedPhrase] = useState('');

  usePageAnalytic(ScreensEnum.CreateAccount);

  useEffect(() => {
    generateSeed().then(seed => setSeedPhrase(seed));
  }, []);

  return <CreateNewPassword seedPhrase={seedPhrase} />;
};
