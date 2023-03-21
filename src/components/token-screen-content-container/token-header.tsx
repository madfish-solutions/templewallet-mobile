import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
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

import { getDelegateText } from '../../utils/get-delegate-text.util';
import { Divider } from '../divider/divider';
import { useApyStyles } from './apy.styles';
import { apyLinkSelectors } from './token-header.selectors';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  showHistoryComponent: boolean;
  token: TokenInterface;
}

export const TokenHeader: FC<Props> = ({ showHistoryComponent, token }) => {
  const styles = useTokenScreenContentContainerStyles();
  const apyStyles = useApyStyles();
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();
  const { trackEvent } = useAnalytics();
  const isTezos = token.address === '';
  const tokenSlug = getTokenSlug(token);

  const { isTezosNode } = useNetworkInfo();

  const { rate: apyRate = 0, link: apyLink } = useTokenApyInfo(tokenSlug);

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
          Get up to {new BigNumber(apyRate).decimalPlaces(2).toFixed(2)}% {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>;
};
