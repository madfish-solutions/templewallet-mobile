import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useTokensExchangeRatesSelector } from '../../../store/currency/currency-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { formatAssetAmount } from '../../../utils/number.util';
import { Divider } from '../../divider/divider';
import { DollarEquivalentText } from '../../dollar-equivalent-text/dollar-equivalent-text';
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

  const { address, symbol, name, balance, iconName = IconNameEnum.NoNameToken } = token;
  const { tokensExchangeRates, tezosExchangeRate } = useTokensExchangeRatesSelector();
  const exchangeRate = name === TEZ_TOKEN_METADATA.name ? tezosExchangeRate.data : tokensExchangeRates.data[address];

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
        <View>
          <Text style={styles.balance}>
            {formattedBalance} {symbol}
          </Text>
          <DollarEquivalentText
            balance={formattedBalance}
            exchangeRate={exchangeRate}
            style={styles.dollarEquivalent}
          />
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
