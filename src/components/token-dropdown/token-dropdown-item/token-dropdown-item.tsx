import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { MultichainTokenIcon, MultichainTokenIconProps } from 'src/components/multichain-token-icon';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { emptyToken } from 'src/token/interfaces/token.interface';
import { assetsEqualityFn, isCollectibleAsset } from 'src/utils/asset.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { Divider } from '../../divider/divider';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { IconV2 } from '../../icon-v2';
import { IconNameV2Enum } from '../../icon-v2/icon-name.enum';

import { useTokenDropdownItemStyles } from './token-dropdown-item.styles';
import { tokenDropdownItemVariantConfigs } from './token-dropdown-item.variants';
import type { TokenDropdownItemVariant } from './token-dropdown-item.variants';

interface Props {
  token?: AssetInterface;
  actionIconName?: IconNameEnum;
  actionIconV2Name?: IconNameV2Enum;
  isShowBalance?: boolean;
  isShowBalanceLoading?: boolean;
  isShowName?: boolean;
  variant?: TokenDropdownItemVariant;
}

interface EvmTokenAsset extends AssetInterface {
  assetSlug: string;
  chainId: number;
  chainKind: TempleChainKind.EVM;
}

type EvmTokenCandidate = AssetInterface & { chainId?: unknown };

const isEvmToken = (token: EvmTokenCandidate): token is EvmTokenAsset =>
  token.chainKind === TempleChainKind.EVM && typeof token.assetSlug === 'string' && typeof token.chainId === 'number';

const getTokenIconProps = (token: AssetInterface): MultichainTokenIconProps => {
  if (isEvmToken(token)) {
    return {
      chainKind: TempleChainKind.EVM,
      chainId: token.chainId,
      address: token.assetSlug,
      iconName: token.iconName,
      iconURL: token.thumbnailUri,
      isCollectible: isCollectibleAsset(token)
    };
  }

  if (token.chainKind === TempleChainKind.Tezos) {
    return {
      chainKind: TempleChainKind.Tezos,
      iconName: token.iconName,
      thumbnailUri: token.thumbnailUri,
      isCollectible: isCollectibleAsset(token)
    };
  }

  return { iconName: token.iconName, thumbnailUri: token.thumbnailUri };
};

export const TokenDropdownItem: FC<Props> = ({
  token = emptyToken,
  actionIconName,
  actionIconV2Name,
  isShowBalance = true,
  isShowBalanceLoading = false,
  isShowName = true,
  variant = 'v1'
}) => {
  const styles = useTokenDropdownItemStyles();
  const { isCompact, listIconConfig, selectedIconConfig, showNetworkBadge } = tokenDropdownItemVariantConfigs[variant];
  const {
    gap: iconGap,
    size: iconSize,
    visualSize: iconVisualSize
  } = isShowBalance ? listIconConfig : selectedIconConfig;
  const hasActionIcon = isDefined(actionIconName) || isDefined(actionIconV2Name);
  const tokenNameTextStyle = useMemo(
    () => [styles.name, isCompact && styles.compactName, conditionalStyle(!hasActionIcon, styles.fullWidthName)],
    [hasActionIcon, isCompact, styles]
  );
  const iconContainerStyle = useMemo(
    () => [styles.iconContainer, { width: iconSize, height: iconSize }],
    [iconSize, styles]
  );
  const tokenIconProps = getTokenIconProps(token);

  if (assetsEqualityFn(token, emptyToken)) {
    return (
      <View style={styles.container}>
        <TokenIcon iconName={token.iconName} size={iconVisualSize} thumbnailUri={token.thumbnailUri} />
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
    <View style={[styles.container, isCompact && styles.compactContainer]}>
      {showNetworkBadge ? (
        <MultichainTokenIcon {...tokenIconProps} size={iconVisualSize} showNetworkBadge />
      ) : (
        <View style={iconContainerStyle}>
          <View style={styles.iconVisualContainer}>
            <MultichainTokenIcon {...tokenIconProps} size={iconVisualSize} />
          </View>
        </View>
      )}
      <Divider size={iconGap} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <TruncatedText style={[styles.symbol, isCompact && styles.compactSymbol]}>{token.symbol}</TruncatedText>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isShowBalance && (
              <HideBalance wrapperStyle={styles.balanceWrapper} textStyle={styles.balance}>
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
          {isShowName && <TruncatedText style={tokenNameTextStyle}>{token.name}</TruncatedText>}

          <View style={styles.rightContainer}>
            {isShowName && <Divider size={formatSize(4)} />}
            {isShowBalance && (
              <HideBalance
                wrapperStyle={[
                  styles.dollarEquivalentWrapper,
                  conditionalStyle(isDefined(actionIconName), styles.actionIconSubstitute)
                ]}
                textStyle={styles.dollarEquivalent}
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
