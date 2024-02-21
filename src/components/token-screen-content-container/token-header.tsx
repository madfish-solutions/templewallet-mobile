import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { Alert, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { INITIAL_APR_VALUE } from 'src/apis/youves/constants';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { white } from 'src/config/styles';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTokenApyInfo } from 'src/hooks/use-token-apy.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { removeTokenAction } from 'src/store/wallet/wallet-actions';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getDelegateText } from 'src/utils/get-delegate-text.util';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { useApyStyles } from './apy.styles';
import { apyLinkSelectors } from './token-header.selectors';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  showHistoryComponent: boolean;
  token: TokenInterface;
  scam?: boolean;
}

const DECIMAL_VALUE = 2;

export const TokenHeader: FC<Props> = ({ showHistoryComponent, token, scam }) => {
  const dispatch = useDispatch();
  const styles = useTokenScreenContentContainerStyles();
  const apyStyles = useApyStyles();
  const { navigate } = useNavigation();
  const currentBaker = useSelectedBakerSelector();
  const { trackEvent } = useAnalytics();
  const isTezos = token.address === '';
  const tokenSlug = getTokenSlug(token);
  const { isDcpNode } = useNetworkInfo();

  const navigationFlow = () => {
    isDcpNode && !currentBaker ? navigate(ModalsEnum.SelectBaker) : navigate(ScreensEnum.Delegation);
  };

  const { rate: apyRate = INITIAL_APR_VALUE, link: apyLink } = useTokenApyInfo(tokenSlug);

  const apyRateValue = useMemo(
    () => new BigNumber(apyRate).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE),
    [apyRate]
  );

  const handleScamPress = useCallback(
    () =>
      Alert.alert(
        'Be cautious!',
        'This token may be a scam. We strongly advise removing it from your token list to safeguard against the risk of losing funds.',
        [
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(removeTokenAction(tokenSlug));
              navigate(ScreensEnum.Wallet);
            }
          }
        ]
      ),
    [tokenSlug]
  );

  const handleApyPress = useCallback(() => {
    if (!apyLink) {
      return;
    }

    const eventName = `${apyLinkSelectors[apyLink]}/${token.name}`;

    trackEvent(eventName, AnalyticsEventCategory.ButtonPress);

    openUrl(apyLink);
  }, [apyLink]);

  if (showHistoryComponent && isTezos) {
    return (
      <TouchableOpacity style={styles.delegateContainer} onPress={navigationFlow}>
        <Text style={styles.delegateText}>{currentBaker ? 'Rewards & Redelegate' : 'Not Delegated'}</Text>
      </TouchableOpacity>
    );
  }

  if (showHistoryComponent && scam) {
    return (
      <TouchableOpacity onPress={handleScamPress} style={styles.scamContainer}>
        <Icon name={IconNameEnum.ScamInfo} size={formatSize(24)} color={white} />
        <Text style={styles.scamText}>Scam</Text>
      </TouchableOpacity>
    );
  }

  if (showHistoryComponent && isDefined(apyLink) && apyRate !== 0) {
    const label = getDelegateText(token);

    return (
      <TouchableOpacity onPress={handleApyPress} style={[styles.delegateContainer, apyStyles[tokenSlug]]}>
        <Text style={styles.delegateText}>
          Get up to {apyRateValue}% {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>;
};
