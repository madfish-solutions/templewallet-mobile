import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector, useQuotesSelector } from '../../store/currency/currency-selectors';
import { useFiatCurrencySelector } from '../../store/settings/settings-selectors';
import { TEZ_TOKEN_SLUG } from '../../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz } from '../../utils/tezos.util';
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

  const parsedAmount = mutezToTz(new BigNumber(amount), asset.decimals);
  const visibleAmount = convertToDollar ? parsedAmount.multipliedBy(trueExchangeRate) : parsedAmount;
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
