import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TokenContainer } from 'src/components/token-container/token-container';
import { delegationApy } from 'src/config/general';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useIsSaplingCredentialsLoadedSelector, useShieldedBalanceSelector } from 'src/store/sapling';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { useTezosTokenBalanceSplitStyles } from './tezos-token.styles';
import { TokenListItem } from './token-list-item';
import { useTokenListItemStyles } from './token-list-item.styles';

const SHIELDED_BALANCE_INFO_TITLE = 'Public and Shielded balance';
const SHIELDED_BALANCE_INFO_MESSAGE =
  'Your public TEZ balance is your everyday transparent account balance. Anyone with your address can see your tokens and where you\'ve sent them.\n\nShielded TEZ balance is your private stash with a secure pool with "invisible" tokens and transactions, making operations incognito.\n\nYou can move funds between them whenever you need to "go off the grid" or return to the public records.';

export const TezosToken = memo(() => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const currentBaker = useSelectedBakerSelector();
  const navigateToScreen = useNavigateToScreen();
  const { isTezosNode } = useNetworkInfo();
  const shieldedBalanceMutez = useShieldedBalanceSelector();
  const showBalanceSplit = useIsSaplingCredentialsLoadedSelector();

  const combinedToken = useMemo(() => {
    if (!showBalanceSplit) {
      return tezosToken;
    }

    const combinedBalance = new BigNumber(tezosToken.balance).plus(shieldedBalanceMutez).toFixed();

    return { ...tezosToken, balance: combinedBalance };
  }, [tezosToken, shieldedBalanceMutez, showBalanceSplit]);

  const formattedPublicBalance = useMemo(() => {
    if (!showBalanceSplit || !tezosToken.balance) {
      return null;
    }

    return mutezToTz(new BigNumber(tezosToken.balance), TEZ_TOKEN_METADATA.decimals).toFormat();
  }, [showBalanceSplit, tezosToken.balance]);

  const formattedShieldedBalance = useMemo(() => {
    if (!showBalanceSplit) {
      return null;
    }

    return mutezToTz(new BigNumber(shieldedBalanceMutez), TEZ_TOKEN_METADATA.decimals).toFormat();
  }, [showBalanceSplit, shieldedBalanceMutez]);

  const onPress = useCallback(() => navigateToScreen({ screen: ScreensEnum.TezosTokenScreen }), [navigateToScreen]);

  const handleInfoPress = useCallback(() => {
    Alert.alert(SHIELDED_BALANCE_INFO_TITLE, SHIELDED_BALANCE_INFO_MESSAGE);
  }, []);

  const styles = useTezosTokenBalanceSplitStyles();
  const tokenListItemStyles = useTokenListItemStyles();

  if (!showBalanceSplit) {
    return (
      <TokenListItem
        token={combinedToken}
        apy={isTezosNode && currentBaker ? delegationApy : undefined}
        onPress={onPress}
      />
    );
  }

  const apy = isTezosNode && currentBaker ? delegationApy : undefined;

  return (
    <TouchableOpacity onPress={onPress} style={styles.outerContainer}>
      <View style={tokenListItemStyles.container}>
        <TokenContainer token={combinedToken} apy={apy} style={styles.tokenRowNoBorder}>
          <View style={tokenListItemStyles.rightContainer}>
            <HideBalance style={tokenListItemStyles.balanceText}>
              <AssetValueText asset={combinedToken} amount={combinedToken.balance} showSymbol={false} />
            </HideBalance>
            <HideBalance style={tokenListItemStyles.valueText}>
              <AssetValueText asset={combinedToken} convertToDollar amount={combinedToken.balance} />
            </HideBalance>
          </View>
        </TokenContainer>
      </View>

      <View style={styles.balanceSplitContainer}>
        <View style={styles.balancePill}>
          <View style={styles.balancePillTextContainer}>
            <Text style={styles.balancePillText}>Public:</Text>
            <HideBalance style={styles.balancePillTextNumber}>{formattedPublicBalance}</HideBalance>
          </View>
        </View>
        <View style={styles.balancePill}>
          <View style={styles.balancePillTextContainer}>
            <Text style={styles.balancePillText}>Shielded:</Text>
            <HideBalance style={styles.balancePillTextNumber}>{formattedShieldedBalance}</HideBalance>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleInfoPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.infoButton}
        >
          <Icon name={IconNameEnum.InfoFilled} size={formatSize(20)} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});
