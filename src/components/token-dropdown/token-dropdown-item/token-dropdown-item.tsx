import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { formatSize } from 'src/styles/format-size';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { Divider } from '../../divider/divider';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { IconV2 } from '../../icon-v2';
import { IconNameV2Enum } from '../../icon-v2/icon-name.enum';
import { TokenIcon } from '../../token-icon/token-icon';
import { tokenEqualityFn } from '../token-equality-fn';

import { useTokenDropdownItemStyles } from './token-dropdown-item.styles';

interface Props {
  token?: TokenInterface;
  actionIconName?: IconNameEnum;
  actionIconV2Name?: IconNameV2Enum;
  isShowBalance?: boolean;
  isShowBalanceLoading?: boolean;
  isShowName?: boolean;
  iconSize?: number;
  iconVisualSize?: number;
  iconGap?: number;
}

export const TokenDropdownItem: FC<Props> = ({
  token = emptyToken,
  actionIconName,
  actionIconV2Name,
  isShowBalance = true,
  isShowBalanceLoading = false,
  isShowName = true,
  iconSize = formatSize(40),
  iconVisualSize = iconSize,
  iconGap = formatSize(8)
}) => {
  const styles = useTokenDropdownItemStyles();
  const chainKind = (token as TokenInterface & { chainKind?: TempleChainKind }).chainKind;
  const networkName = (token as TokenInterface & { networkName?: string }).networkName;
  const chainLogoName =
    chainKind === TempleChainKind.Tezos
      ? CryptoLogoNameEnum.Tezos
      : chainKind === TempleChainKind.EVM
      ? CryptoLogoNameEnum.Etherlink
      : undefined;
  const hasActionIcon = isDefined(actionIconName) || isDefined(actionIconV2Name);

  const tokenNameTextStyle = useMemo(
    () => [styles.name, conditionalStyle(!hasActionIcon, styles.fullWidthName)],
    [hasActionIcon, styles]
  );

  if (tokenEqualityFn(token, emptyToken)) {
    return (
      <View style={styles.container}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconVisualSize} />
        <Divider size={iconGap} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Select</Text>
            <View style={styles.rightContainer}>
              <Divider size={formatSize(4)} />
              {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
              {isDefined(actionIconV2Name) && <IconV2 name={actionIconV2Name} size={12} />}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Token</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        <View style={styles.iconVisualContainer}>
          <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconVisualSize} />
        </View>
        {isDefined(chainLogoName) && (
          <View style={styles.chainBadge}>
            <CryptoLogo name={chainLogoName} size={formatSize(12)} internalSize={formatSize(12)} />
          </View>
        )}
      </View>
      <Divider size={iconGap} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <TruncatedText style={styles.symbol}>{token.symbol}</TruncatedText>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isShowBalance && (
              <HideBalance style={styles.balance}>
                {isShowBalanceLoading ? (
                  '---'
                ) : (
                  <AssetValueText asset={token} amount={token?.balance} showSymbol={false} />
                )}
              </HideBalance>
            )}
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
            {isDefined(actionIconV2Name) && <IconV2 name={actionIconV2Name} size={12} />}
          </View>
        </View>

        <View style={styles.infoRow}>
          {isShowName && <TruncatedText style={tokenNameTextStyle}>{networkName ?? token.name}</TruncatedText>}

          <View style={styles.rightContainer}>
            {isShowName && <Divider size={formatSize(4)} />}
            {isShowBalance && (
              <HideBalance
                style={[styles.dollarEquivalent, conditionalStyle(hasActionIcon, styles.actionIconSubstitute)]}
              >
                {isShowBalanceLoading ? (
                  '---'
                ) : (
                  <AssetValueText asset={token} convertToDollar amount={token?.balance} />
                )}
              </HideBalance>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
