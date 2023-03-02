import React, { FC, useEffect, useState } from 'react';

import { OVERLAY_SHOW_TIMEOUT } from '../../../../components/mnemonic/mnemonic.config';
import { RevealSecretView } from '../../../../components/mnemonic/reveal-secret-view/reveal-secret-view';
import { useActiveTimer } from '../../../../hooks/use-active-timer.hook';
import { TestIdProps } from '../../../../interfaces/test-id.props';
import { useShelter } from '../../../../shelter/use-shelter.hook';
import { setTestID } from '../../../../utils/test-id.utils';

interface Props extends TestIdProps {
  publicKeyHash: string;
}

export const RevealSeedPhraseView: FC<Props> = ({ publicKeyHash, testID }) => {
  const { revealSeedPhrase } = useShelter();
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const [seedPhrase, setSeedPhrase] = useState<string>();

  useEffect(() => {
    clearActiveTimer();
    setSeedPhrase(undefined);
  }, [publicKeyHash]);

  const handleProtectedOverlayPress = () => {
    revealSeedPhrase({
      successCallback: value => {
        clearActiveTimer();

        setSeedPhrase(value);
        activeTimer.current = setTimeout(() => setSeedPhrase(undefined), OVERLAY_SHOW_TIMEOUT);
      }
    });
  };

  return (
    <RevealSecretView value={seedPhrase} onProtectedOverlayPress={handleProtectedOverlayPress} {...setTestID(testID)} />
  );
};
