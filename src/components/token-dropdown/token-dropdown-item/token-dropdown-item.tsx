import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { Divider } from '../../divider/divider';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TokenIcon } from '../../token-icon/token-icon';
import { tokenEqualityFn } from '../token-equality-fn';
import { useTokenDropdownItemStyles } from './token-dropdown-item.styles';

interface Props {
  token?: TokenInterface;
  actionIconName?: IconNameEnum;
  isShowBalance?: boolean;
  isShowBalanceLoading?: boolean;
  isShowName?: boolean;
  iconSize?: number;
}

export const TokenDropdownItem: FC<Props> = ({
  token = emptyToken,
  actionIconName,
  isShowBalance = true,
  isShowBalanceLoading = false,
  isShowName = true,
  iconSize = formatSize(40)
}) => {
  const styles = useTokenDropdownItemStyles();

  if (tokenEqualityFn(token, emptyToken)) {
    return (
      <View style={styles.container}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconSize} />
        <Divider size={formatSize(8)} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Select</Text>
            <View style={styles.rightContainer}>
              <Divider size={formatSize(4)} />
              {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
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
      <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} size={iconSize} />
      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.symbol)}>{token.symbol}</Text>
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
          </View>
        </View>

        <View style={styles.infoRow}>
          {isShowName && <Text {...getTruncatedProps(styles.name)}>{token.name}</Text>}

          <View style={styles.rightContainer}>
            {isShowName && <Divider size={formatSize(4)} />}
            {isShowBalance && (
              <HideBalance
                style={[
                  styles.dollarEquivalent,
                  conditionalStyle(isDefined(actionIconName), styles.actionIconSubstitute)
                ]}
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
