import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { MultichainTokenIcon } from 'src/components/multichain-token-icon';
import { getMultichainTokenIconProps } from 'src/components/multichain-token-icon/get-multichain-token-icon-props';
import { PublicShieldedBalancePills } from 'src/components/public-shielded-balance-pills/public-shielded-balance-pills';
import { TokenTag } from 'src/components/token-tag/token-tag';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useMultichainTokenListItemStyles } from './multichain-token-list-item.styles';

const SHIELDED_BALANCE_INFO_TITLE = 'Public and Shielded balance';
const SHIELDED_BALANCE_INFO_MESSAGE =
  'Your public TEZ balance is your everyday transparent account balance. Anyone with your address can see your tokens and where you\'ve sent them.\n\nShielded TEZ balance is your private stash with a secure pool with "invisible" tokens and transactions, making operations incognito.\n\nYou can move funds between them whenever you need to "go off the grid" or return to the public records.';

const showShieldedBalanceInfo = () => Alert.alert(SHIELDED_BALANCE_INFO_TITLE, SHIELDED_BALANCE_INFO_MESSAGE);

interface Props {
  token: MultichainDisplayedToken;
  scam?: boolean;
  apy?: number;
}

export const MultichainTokenListItem = memo<Props>(({ token, scam, apy }) => {
  const styles = useMultichainTokenListItemStyles();
  const colors = useColors();
  const navigateToScreen = useNavigateToScreen();

  const isTezos = token.chainKind === TempleChainKind.Tezos;
  const isTezosGasToken = isTezos && token.slug === TEZ_TOKEN_SLUG;
  const original = token.original;

  const tokenAmount = useMemo(
    () => mutezToTz(new BigNumber(token.atomicBalance), token.decimals),
    [token.atomicBalance, token.decimals]
  );
  const fiatAmount = useMemo(() => new BigNumber(token.fiatValue ?? 0), [token.fiatValue]);

  const handlePress = useCallback(
    () =>
      navigateToScreen({
        screen: ScreensEnum.TokenScreen,
        params: { descriptor: { chainKind: token.chainKind, chainId: token.chainId, slug: token.slug } }
      }),
    [token.chainKind, token.chainId, token.slug, navigateToScreen]
  );

  const content = (
    <>
      <View style={styles.leftContainer}>
        <MultichainTokenIcon {...getMultichainTokenIconProps(token)} />
        <Divider size={formatSize(4)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <TruncatedText style={styles.symbolText}>{token.symbol}</TruncatedText>
            {isTezos && isDefined(original) && <TokenTag token={original} scam={scam} apy={apy} />}
          </View>
          <TruncatedText style={styles.tokenNameText}>{token.name}</TruncatedText>
        </View>
      </View>

      <View style={styles.rightContainer}>
        {isTezos && isDefined(original) ? (
          <>
            <HideBalance textStyle={styles.balanceText}>
              <AssetValueText asset={original} amount={original.balance} showSymbol={false} />
            </HideBalance>
            <HideBalance textStyle={styles.valueText}>
              <AssetValueText asset={original} convertToDollar amount={original.balance} />
            </HideBalance>
          </>
        ) : (
          <>
            <HideBalance textStyle={styles.balanceText}>
              <FormattedAmount amount={tokenAmount} />
            </HideBalance>
            {isDefined(token.fiatValue) && (
              <HideBalance textStyle={styles.valueText}>
                <FormattedAmount amount={fiatAmount} isDollarValue />
              </HideBalance>
            )}
          </>
        )}
      </View>
    </>
  );

  if (isTezosGasToken) {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.gasTokenContainer}>
        <View style={[styles.container, styles.gasTokenSubcontainer]}>{content}</View>

        <View style={styles.balanceSplitContainer}>
          <PublicShieldedBalancePills
            atomicBalance={token.atomicBalance}
            shieldedAtomicBalance={token.shieldedAtomicBalance}
          />
          <TouchableOpacity
            onPress={showShieldedBalanceInfo}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.infoButton}
          >
            <IconV2 name={IconNameV2Enum.InfoFill} color={colors.gray2} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {content}
    </TouchableOpacity>
  );
});
