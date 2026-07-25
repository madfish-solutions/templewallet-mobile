import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { EvmTokenIcon } from 'src/components/token-icon/evm-token-icon';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TokenTag } from 'src/components/token-tag/token-tag';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useMultichainTokenListItemStyles } from './multichain-token-list-item.styles';

const ICON_SIZE = formatSize(40);

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
  const shieldedBalanceMutez = token.shieldedAtomicBalance ?? '0';

  const isTezos = token.chainKind === TempleChainKind.Tezos;
  const isTezosGasToken = isTezos && token.slug === TEZ_TOKEN_SLUG;
  const isEvmContractToken = !isTezos && token.slug !== EVM_TOKEN_SLUG;
  const original = token.original;

  const badgeLogoName = isTezos ? CryptoLogoNameEnum.Tezos : CryptoLogoNameEnum.Etherlink;
  const mainIconName = isTezos
    ? original?.iconName
    : token.slug === EVM_TOKEN_SLUG
    ? CryptoLogoNameEnum.Tezos
    : undefined;
  const mainThumbnailUri = mainIconName ? undefined : token.iconUri;

  const tokenAmount = useMemo(
    () => mutezToTz(new BigNumber(token.atomicBalance), token.decimals),
    [token.atomicBalance, token.decimals]
  );
  const fiatAmount = useMemo(() => new BigNumber(token.fiatValue ?? 0), [token.fiatValue]);

  const handlePress = useCallback(() => {
    if (isTezosGasToken) {
      navigateToScreen({ screen: ScreensEnum.TezosTokenScreen });
    } else if (isDefined(original)) {
      navigateToScreen({ screen: ScreensEnum.TokenScreen, params: { token: original } });
    }
  }, [isTezosGasToken, original, navigateToScreen]);

  const formattedPublicBalance = useMemo(
    () =>
      isTezosGasToken
        ? mutezToTz(new BigNumber(token.atomicBalance).minus(shieldedBalanceMutez), TEZ_TOKEN_DECIMALS).toFormat()
        : null,
    [isTezosGasToken, token.atomicBalance, shieldedBalanceMutez]
  );
  const formattedShieldedBalance = useMemo(
    () => (isTezosGasToken ? mutezToTz(new BigNumber(shieldedBalanceMutez), TEZ_TOKEN_DECIMALS).toFormat() : null),
    [isTezosGasToken, shieldedBalanceMutez]
  );

  const content = (
    <>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {isEvmContractToken ? (
            <EvmTokenIcon
              size={ICON_SIZE}
              chainId={Number(token.chainId)}
              address={token.slug}
              iconURL={token.iconUri}
            />
          ) : (
            <TokenIcon size={ICON_SIZE} iconName={mainIconName} thumbnailUri={mainThumbnailUri} />
          )}
          <View style={styles.badge}>
            <CryptoLogo name={badgeLogoName} size={formatSize(12)} />
          </View>
        </View>
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
          <View style={styles.balancePill}>
            <Text style={styles.balancePillText}>Public:</Text>
            <HideBalance textStyle={styles.balancePillTextNumber}>{formattedPublicBalance}</HideBalance>
          </View>
          <View style={styles.balancePill}>
            <Text style={styles.balancePillText}>Shielded:</Text>
            <HideBalance textStyle={styles.balancePillTextNumber}>{formattedShieldedBalance}</HideBalance>
          </View>
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

  if (isTezos) {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
});
