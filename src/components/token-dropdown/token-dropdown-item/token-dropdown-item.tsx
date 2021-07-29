import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useExchangeRatesSelector } from '../../../store/currency/currency-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { Divider } from '../../divider/divider';
import { DollarValueText } from '../../dollar-value-text/dollar-value-text';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TokenValueText } from '../../token-value-text/token-value-text';
import { useTokenDropdownItemStyles } from './token-dropdown-item.styles';

interface Props {
  token?: TokenInterface;
  actionIconName?: IconNameEnum;
}

export const TokenDropdownItem: FC<Props> = ({ token = emptyToken, actionIconName }) => {
  const styles = useTokenDropdownItemStyles();

  const { address, symbol, name, balance, iconName = IconNameEnum.NoNameToken } = token;
  const { exchangeRates } = useExchangeRatesSelector();
  const exchangeRate =
    name === TEZ_TOKEN_METADATA.name ? exchangeRates.data[TEZ_TOKEN_METADATA.name] : exchangeRates.data[address];

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
        <View>
          <HideBalance style={styles.balance}>
            <TokenValueText balance={balance} tokenSymbol={symbol} />
          </HideBalance>
          <HideBalance style={styles.dollarEquivalent}>
            <DollarValueText balance={balance} exchangeRate={exchangeRate} />
          </HideBalance>
        </View>
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
