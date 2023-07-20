import React, { FC, useEffect, useState } from 'react';

import { OVERLAY_SHOW_TIMEOUT } from 'src/components/mnemonic/mnemonic.config';
import { RevealSecretView } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view';
import { RevealSecretViewSelectors } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view.selectors';
import { useActiveTimer } from 'src/hooks/use-active-timer.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

interface Props {
  publicKeyHash: string;
}

export const RevealPrivateKeyView: FC<Props> = ({ publicKeyHash }) => {
  const { revealSecretKey } = useShelter();
  const { trackEvent } = useAnalytics();
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const [secretKey, setSecretKey] = useState<string>();

  useEffect(() => {
    clearActiveTimer();
    setSecretKey(undefined);
  }, [publicKeyHash]);

  const handleProtectedOverlayPress = () => {
    revealSecretKey({
      publicKeyHash,
      successCallback: value => {
        clearActiveTimer();

        setSecretKey(value);
        activeTimer.current = setTimeout(() => setSecretKey(undefined), OVERLAY_SHOW_TIMEOUT);
      }
    });

    trackEvent(RevealSecretViewSelectors.privateKeyValue, AnalyticsEventCategory.ButtonPress);
  };

  return (
    <RevealSecretView
      value={secretKey}
      onProtectedOverlayPress={handleProtectedOverlayPress}
      testID={RevealSecretViewSelectors.privateKeyValue}
    />
  );
};
