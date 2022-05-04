import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { Divider } from '../../divider/divider';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
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
  iconSize?: number;
}

export const TokenDropdownItem: FC<Props> = ({
  token = emptyToken,
  actionIconName,
  isShowBalance = true,
  iconSize = formatSize(40)
}) => {
  const styles = useTokenDropdownItemStyles();

  const { symbol, name } = token;

  if (tokenEqualityFn(token, emptyToken)) {
    return (
      <View style={styles.placeHolderContainer}>
        <Divider size={formatSize(40)} />
        {/* <Divider size={formatSize(8)} /> */}
        <View style={styles.emptyColumn}>
          <Text style={styles.symbol}>Select</Text>
          <Text style={styles.symbol}>Token</Text>
        </View>
        <View style={styles.rightContainer}>
          <Divider size={formatSize(4)} />
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TokenIcon token={token} size={iconSize} />
      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.symbol)}>{symbol}</Text>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isShowBalance && (
              <HideBalance style={styles.balance}>
                <AssetValueText asset={token} amount={token?.balance} showSymbol={false} />
              </HideBalance>
            )}
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.name)}>{name}</Text>

          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isShowBalance && (
              <HideBalance
                style={[
                  styles.dollarEquivalent,
                  conditionalStyle(isDefined(actionIconName), styles.actionIconSubstitute)
                ]}
              >
                <AssetValueText asset={token} convertToDollar amount={token?.balance} />
              </HideBalance>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export const renderTokenListItem: DropdownListItemComponent<TokenInterface> = ({ item, isSelected }) => (
  <TokenDropdownItem token={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
