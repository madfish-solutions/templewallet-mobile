import React, { FC } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { delegationApy } from '../../config/general';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { useTokensApyInfoSelector } from '../../store/d-apps/d-apps-selectors';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import { openUrl } from '../../utils/linking.util';
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
  const apyInfo = useTokensApyInfoSelector();
  const { trackEvent } = useAnalytics();
  const isTezos = token.address === '';
  const tokenSlug = getTokenSlug(token);
  const tokenApy = apyInfo[tokenSlug];

  const { isTezosNode } = useNetworkInfo();

  const handleApyPress = () => {
    const eventName = `${apyLinkSelectors[tokenApy.link]}/${token.name}`;

    trackEvent(eventName, AnalyticsEventCategory.ButtonPress);

    openUrl(tokenApy.link);
  };

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

  if (showHistoryComponent && isDefined(tokenApy) && tokenApy.rate > 0) {
    return (
      <TouchableOpacity onPress={handleApyPress} style={[styles.delegateContainer, apyStyles[tokenSlug]]}>
        <Text style={styles.delegateText}>Get up to {tokenApy.rate}% APY </Text>
      </TouchableOpacity>
    );
  }

  return <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>;
};
