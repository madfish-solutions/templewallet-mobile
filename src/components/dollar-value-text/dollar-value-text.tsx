import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { useVisibleTokensListSelector, useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';

interface Props {
  token: TokenMetadataInterface;
  amount: string;
  style?: StyleProp<TextStyle>;
  isNegativeAmount?: boolean;
  isSummaryEquityValue?: boolean;
}

// TODO: Replace with AssetValueText
export const DollarValueText: FC<Props> = ({
  token,
  style,
  amount,
  isNegativeAmount = false,
  isSummaryEquityValue = false
}) => {
  const [summaryDollarValue, setSummearyDollarValue] = useState(0);
  const exchangeRates = useExchangeRatesSelector();
  const visibleTokens = useVisibleTokensListSelector();
  const tezosToken = useTezosTokenSelector();

  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(token)];
  const parsedAmount = mutezToTz(new BigNumber(amount), token.decimals).multipliedBy(exchangeRate);

  useEffect(() => {
    let dollarVal = 0;
    for (const token of visibleTokens) {
      const exchangeRate: number | undefined = exchangeRates[getTokenSlug(token)];
      const parsedAmount = mutezToTz(new BigNumber(token.balance), token.decimals).multipliedBy(exchangeRate);
      dollarVal += Number(formatAssetAmount(parsedAmount, BigNumber.ROUND_DOWN, 2));
    }
    const tezosParsedAmount = mutezToTz(new BigNumber(tezosToken.balance), tezosToken.decimals).multipliedBy(
      exchangeRates.tez
    );
    dollarVal += Number(formatAssetAmount(tezosParsedAmount, BigNumber.ROUND_DOWN, 2));
    setSummearyDollarValue(dollarVal);
  }, [visibleTokens, exchangeRates]);

  return isDefined(exchangeRate) ? (
    <Text style={style}>
      ≈ {isNegativeAmount && '- '}
      {isSummaryEquityValue ? summaryDollarValue : formatAssetAmount(parsedAmount, BigNumber.ROUND_DOWN, 2)} $
    </Text>
  ) : null;
};
