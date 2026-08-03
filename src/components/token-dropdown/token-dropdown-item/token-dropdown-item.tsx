import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { TokenIconWithNetwork } from 'src/components/token-icon-with-network/token-icon-with-network';
import { TruncatedText } from 'src/components/truncated-text';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { emptyToken } from 'src/token/interfaces/token.interface';
import { assetsEqualityFn } from 'src/utils/asset.utils';
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
  const chainKind = token.chainKind;
  const networkName = token.networkName;
  const hasActionIcon = isDefined(actionIconName) || isDefined(actionIconV2Name);
  const tokenNameTextStyle = useMemo(
    () => [styles.name, isCompact && styles.tokenSelectorName, conditionalStyle(!hasActionIcon, styles.fullWidthName)],
    [hasActionIcon, isCompact, styles]
  );
  const iconContainerStyle = useMemo(
    () => [styles.iconContainer, { width: iconSize, height: iconSize }],
    [iconSize, styles]
  );

  if (assetsEqualityFn(token, emptyToken)) {
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
    <View style={[styles.container, isCompact && styles.tokenSelectorContainer]}>
      {showNetworkBadge ? (
        <TokenIconWithNetwork chainKind={chainKind}>
          <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconVisualSize} />
        </TokenIconWithNetwork>
      ) : (
        <View style={iconContainerStyle}>
          <View style={styles.iconVisualContainer}>
            <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconVisualSize} />
          </View>
        </View>
      )}
      <Divider size={iconGap} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <TruncatedText style={[styles.symbol, isCompact && styles.tokenSelectorSymbol]}>{token.symbol}</TruncatedText>
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
          {isShowName && <TruncatedText style={tokenNameTextStyle}>{networkName ?? token.name}</TruncatedText>}

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
