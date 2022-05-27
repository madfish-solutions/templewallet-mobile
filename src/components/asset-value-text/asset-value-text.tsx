import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector, useQuotesSelector } from '../../store/currency/currency-selectors';
import { useFiatCurrencySelector } from '../../store/settings/settings-selectors';
import { TEZ_TOKEN_SLUG } from '../../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { getDollarValue } from '../../utils/balance.utils';
import { isDefined } from '../../utils/is-defined';
import { FormattedAmount } from '../formatted-amount';

interface Props {
  amount: string;
  asset: TokenMetadataInterface;
  style?: StyleProp<TextStyle>;
  showMinusSign?: boolean;
  showSymbol?: boolean;
  convertToDollar?: boolean;
}

export const AssetValueText: FC<Props> = ({
  amount,
  asset,
  style,
  showMinusSign = false,
  showSymbol = true,
  convertToDollar = false
}) => {
  const exchangeRates = useExchangeRatesSelector();
  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(asset)];
  const exchangeRateTezos: number | undefined = exchangeRates[TEZ_TOKEN_SLUG];
  const quotes = useQuotesSelector();
  const fiatCurrency = useFiatCurrencySelector();
  const fiatToUsdRate = quotes[fiatCurrency.toLowerCase()] / exchangeRateTezos;
  const trueExchangeRate = fiatToUsdRate * exchangeRate;

  const hideText = convertToDollar && !isDefined(exchangeRate);

  const visibleAmount = getDollarValue(amount, asset, convertToDollar ? trueExchangeRate : 1);
  const visibleSymbol = showSymbol ? asset.symbol : undefined;

  return (
    <Text style={style}>
      {hideText ? (
        ''
      ) : (
        <FormattedAmount
          amount={visibleAmount}
          isDollarValue={convertToDollar}
          showMinusSign={showMinusSign}
          showPlusSign={false}
          symbol={visibleSymbol}
          style={style}
        />
      )}
    </Text>
  );
};
