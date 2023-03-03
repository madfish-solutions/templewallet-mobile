import React, { FC, useEffect, useState } from 'react';

import { OVERLAY_SHOW_TIMEOUT } from '../../../components/mnemonic/mnemonic.config';
import { RevealSecretView } from '../../../components/mnemonic/reveal-secret-view/reveal-secret-view';
import { RevealSecretViewSelectors } from '../../../components/mnemonic/reveal-secret-view/reveal-secret-view.selectors';
import { useActiveTimer } from '../../../hooks/use-active-timer.hook';
import { useShelter } from '../../../shelter/use-shelter.hook';

interface Props {
  publicKeyHash: string;
}

export const RevealPrivateKeyView: FC<Props> = ({ publicKeyHash }) => {
  const { revealSecretKey } = useShelter();
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const [secretKey, setSecretKey] = useState<string>();

  useEffect(() => {
    clearActiveTimer();
    setSecretKey(undefined);
  }, [publicKeyHash]);

  const handleProtectedOverlayPress = () =>
    revealSecretKey({
      publicKeyHash,
      successCallback: value => {
        clearActiveTimer();

        setSecretKey(value);
        activeTimer.current = setTimeout(() => setSecretKey(undefined), OVERLAY_SHOW_TIMEOUT);
      }
    });

  return (
    <RevealSecretView
      value={secretKey}
      onProtectedOverlayPress={handleProtectedOverlayPress}
      testID={RevealSecretViewSelectors.privateKeyValue}
    />
  );
};
