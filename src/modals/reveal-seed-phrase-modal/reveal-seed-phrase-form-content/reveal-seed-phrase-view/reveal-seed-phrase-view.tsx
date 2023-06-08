import React, { FC, useEffect, useState } from 'react';

import { OVERLAY_SHOW_TIMEOUT } from 'src/components/mnemonic/mnemonic.config';
import { RevealSecretView } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view';
import { RevealSecretViewSelectors } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view.selectors';
import { useActiveTimer } from 'src/hooks/use-active-timer.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

interface Props extends TestIdProps {
  publicKeyHash: string;
}

export const RevealSeedPhraseView: FC<Props> = ({ publicKeyHash }) => {
  const { revealSeedPhrase } = useShelter();
  const { trackEvent } = useAnalytics();
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
    trackEvent(RevealSecretViewSelectors.seedPhraseValue, AnalyticsEventCategory.ButtonPress);
  };

  return (
    <RevealSecretView
      value={seedPhrase}
      onProtectedOverlayPress={handleProtectedOverlayPress}
      testID={RevealSecretViewSelectors.seedPhraseValue}
    />
  );
};
