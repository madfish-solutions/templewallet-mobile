import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTokenMetadata } from '../../../../hooks/use-token-metadata.hook';
import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { useTokensExchangeRatesSelector } from '../../../../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../../../../store/wallet/wallet-actions';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { getTokenAddressFromSlug } from '../../../../token/utils/token.utils';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isString } from '../../../../utils/is-string';
import { formatAssetAmount } from '../../../../utils/number.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupAmountChange: FC<Props> = ({ group }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const dispatch = useDispatch();
  const { getTokenMetadata } = useTokenMetadata();
  const { tokensExchangeRates, tezosExchangeRate } = useTokensExchangeRatesSelector();

  const nonZeroAmounts = useMemo(() => {
    const amounts = [];
    let positiveAmountSum = 0;
    for (const { amount, tokenSlug } of group) {
      const { decimals, symbol, name, address } = getTokenMetadata(tokenSlug);
      if (isString(tokenSlug) && !isString(name)) {
        const { address, id } = getTokenAddressFromSlug(tokenSlug);
        dispatch(loadTokenMetadataActions.submit({ id: Number(id), address: address }));
      }
      let exchangeRate = 0;
      if (isString(address)) {
        exchangeRate = tokensExchangeRates.data[address];
      } else if (name === TEZ_TOKEN_METADATA.name) {
        exchangeRate = tezosExchangeRate.data;
      }
      const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
      const isPositive = parsedAmount.isPositive();

      if (isPositive) {
        positiveAmountSum += parsedAmount.toNumber() * exchangeRate;
      }

      amounts.push({
        parsedAmount,
        isPositive,
        symbol,
        exchangeRate
      });
    }

    const dollarSum = formatAssetAmount(new BigNumber(positiveAmountSum), BigNumber.ROUND_DOWN, 2);

    return { amounts, dollarSum };
  }, [group, getTokenMetadata]);

  const isShowValueText = nonZeroAmounts.amounts.length > 0;

  return (
    <View style={styles.container}>
      {nonZeroAmounts.amounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text key={index} style={[styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)]}>
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {symbol}
        </Text>
      ))}

      {isShowValueText && <Text style={styles.valueText}>{nonZeroAmounts.dollarSum} $</Text>}
    </View>
  );
};
