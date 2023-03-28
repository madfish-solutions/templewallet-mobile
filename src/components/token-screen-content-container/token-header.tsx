import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { delegationApy } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTokenApyInfo } from 'src/hooks/use-token-apy.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';

import { INITIAL_ARP_VALUE } from '../../apis/youves/constants';
import { getDelegateText } from '../../utils/get-delegate-text.util';
import { Divider } from '../divider/divider';
import { useApyStyles } from './apy.styles';
import { apyLinkSelectors } from './token-header.selectors';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  showHistoryComponent: boolean;
  token: TokenInterface;
}

const DECIMAL_VALUE = 2;

export const TokenHeader: FC<Props> = ({ showHistoryComponent, token }) => {
  const styles = useTokenScreenContentContainerStyles();
  const apyStyles = useApyStyles();
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();
  const { trackEvent } = useAnalytics();
  const isTezos = token.address === '';
  const tokenSlug = getTokenSlug(token);

  const { isTezosNode } = useNetworkInfo();

  const { rate: apyRate = INITIAL_ARP_VALUE, link: apyLink } = useTokenApyInfo(tokenSlug);

  const apyRateValue = useMemo(
    () => new BigNumber(apyRate).decimalPlaces(DECIMAL_VALUE).toFixed(DECIMAL_VALUE),
    [apyRate]
  );

  if (showHistoryComponent && isTezos) {
    return isTezosNode ? (
      <TouchableOpacity style={styles.delegateContainer} onPress={() => navigate(ScreensEnum.Delegation)}>
        {isBakerSelected ? (
          <Text style={styles.delegateText}>Rewards & Redelegate</Text>
        ) : (
          <Text style={styles.delegateText}>
            Delegate: <Text style={styles.apyText}>{delegationApy}% APY</Text>
          </Text>
        )}
      </TouchableOpacity>
    ) : (
      <Divider />
    );
  }

  const handleApyPress =
    isDefined(apyLink) && apyRate !== 0
      ? () => {
          const eventName = `${apyLinkSelectors[apyLink]}/${token.name}`;

          trackEvent(eventName, AnalyticsEventCategory.ButtonPress);

          openUrl(apyLink);
        }
      : undefined;

  if (showHistoryComponent && isDefined(handleApyPress)) {
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
