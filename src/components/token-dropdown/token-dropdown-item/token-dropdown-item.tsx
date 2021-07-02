import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { formatAssetAmount } from '../../../utils/number.util';
import { Divider } from '../../divider/divider';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useTokenDropdownItemStyles } from './token-dropdown-item.styles';

interface Props {
  token?: TokenInterface;
  actionIconName?: IconNameEnum;
}

export const TokenDropdownItem: FC<Props> = ({ token = emptyToken, actionIconName }) => {
  const styles = useTokenDropdownItemStyles();

  const { symbol, name, balance, iconName = IconNameEnum.NoNameToken } = token;

  const formattedBalance = formatAssetAmount(new BigNumber(balance));

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Icon name={iconName} size={formatSize(40)} />
        <Divider size={formatSize(8)} />
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.balance}>
          {formattedBalance} {symbol}
        </Text>
        {isDefined(actionIconName) && (
          <>
            <Divider size={formatSize(8)} />
            <Icon name={actionIconName} size={formatSize(24)} />
          </>
        )}
      </View>
    </View>
  );
};

export const renderTokenListItem: DropdownListItemComponent<TokenInterface> = ({ item, isSelected }) => (
  <TokenDropdownItem token={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
