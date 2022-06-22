import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { delegationApy } from '../../config/general';
import { QUIPU_SLUG } from '../../config/tokens';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { useQuipuApySelector } from '../../store/d-apps/d-apps-selectors';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { openUrl } from '../../utils/linking.util';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  showHistoryComponent: boolean;
  token: TokenInterface;
}

export const TokenHeader: FC<Props> = ({ showHistoryComponent, token }) => {
  const styles = useTokenScreenContentContainerStyles();
  const quipuApy = useQuipuApySelector();
  const formattedApy = useMemo(() => quipuApy.toFixed(2).replace(/[.,]00$/, ''), [quipuApy]);
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();
  const isTezos = token.address === '';

  if (showHistoryComponent && isTezos === true) {
    return (
      <TouchableOpacity style={styles.delegateContainer} onPress={() => navigate(ScreensEnum.Delegation)}>
        {isBakerSelected ? (
          <Text style={styles.delegateText}>Rewards & Redelegate</Text>
        ) : (
          <Text style={styles.delegateText}>
            Delegate: <Text style={styles.apyText}>{delegationApy}% APY</Text>
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  if (showHistoryComponent && getTokenSlug(token) === QUIPU_SLUG) {
    return (
      <TouchableOpacity style={styles.delegateContainer} onPress={() => openUrl('https://quipuswap.com/farming/3')}>
        <Text style={styles.delegateText}>Earn up to {formattedApy}% APY</Text>
      </TouchableOpacity>
    );
  }

  return <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>;
};
