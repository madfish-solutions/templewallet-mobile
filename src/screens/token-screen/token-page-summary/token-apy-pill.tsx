import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import fireAnimation from 'src/assets/animations/fire-animation.json';
import { LottieAnimation } from 'src/components/lottie-animation';
import { delegationApy } from 'src/config/general';
import { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { useTokenApyInfo } from 'src/hooks/use-token-apy.hook';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { conditionalStyle } from 'src/utils/conditional-style';
import { APY_LINK_SELECTORS } from 'src/utils/constants/apy';
import { getDelegateText } from 'src/utils/get-delegate-text.util';
import { isDefined } from 'src/utils/is-defined';
import { useOpenUrl } from 'src/utils/linking';

import { useTokenApyPillStyles } from './token-apy-pill.styles';

const DECIMAL_VALUE = 2;

const TEZ_APY_LABEL = `${new BigNumber(delegationApy).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE)}% APY`;

interface Props {
  token: MultichainDisplayedToken;
  isTezosGasToken: boolean;
}

export const TokenApyPill = memo<Props>(({ token, isTezosGasToken }) => {
  const styles = useTokenApyPillStyles();
  const navigateToScreen = useNavigateToScreen();
  const currentBaker = useSelectedBakerSelector();
  const theme = useThemeSelector();

  const containerStyle = [styles.container, conditionalStyle(theme === ThemesEnum.dark, styles.darkThemeContainer)];
  const { trackEvent } = useAnalytics();
  const openUrlWithPreference = useOpenUrl();

  const { rate = 0, link } = useTokenApyInfo(token.slug);

  const youvesLabel = useMemo(
    () => `${new BigNumber(rate).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE)}% ${getDelegateText(token)}`,
    [rate, token]
  );

  const handleTezPress = useCallback(() => navigateToScreen({ screen: ScreensEnum.Delegation }), [navigateToScreen]);

  const handleYouvesPress = useCallback(() => {
    if (!link) {
      return;
    }

    trackEvent(`${APY_LINK_SELECTORS[link]}/${token.name}`, AnalyticsEventCategory.ButtonPress);
    openUrlWithPreference(link);
  }, [link, trackEvent, token.name, openUrlWithPreference]);

  if (isTezosGasToken) {
    return (
      <TouchableOpacity style={containerStyle} onPress={handleTezPress}>
        <LottieAnimation source={fireAnimation} style={styles.flame} />
        <Text style={styles.text}>{currentBaker ? TEZ_APY_LABEL : 'Not Delegated'}</Text>
      </TouchableOpacity>
    );
  }

  if (isDefined(link) && rate !== 0) {
    return (
      <TouchableOpacity style={containerStyle} onPress={handleYouvesPress}>
        <LottieAnimation source={fireAnimation} style={styles.flame} />
        <Text style={styles.text}>{youvesLabel}</Text>
      </TouchableOpacity>
    );
  }

  return null;
});
