import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTokenMetadataGetter } from '../../../../hooks/use-token-metadata-getter.hook';
import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { useExchangeRatesSelector } from '../../../../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../../../../store/wallet/wallet-actions';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { isString } from '../../../../utils/is-string';
import { formatAssetAmount, roundFiat } from '../../../../utils/number.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupAmountChange: FC<Props> = ({ group }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useExchangeRatesSelector();

  const nonZeroAmounts = useMemo(() => {
    const amounts = [];
    let positiveAmountSum = 0;
    let negativeAmountSum = 0;

    for (const { address, id, amount } of group) {
      const slug = getTokenSlug({ address, id });
      const { decimals, symbol, name } = getTokenMetadata(slug);
      const exchangeRate: number | undefined = exchangeRates[slug];

      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: id ?? 0 }));
      }

      const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
      const isPositive = parsedAmount.isPositive();

      if (isDefined(exchangeRate)) {
        const summand = parsedAmount.toNumber() * exchangeRate;
        if (isPositive) {
          positiveAmountSum += summand;
        } else {
          negativeAmountSum += summand;
        }
      }

      if (!parsedAmount.isEqualTo(0)) {
        amounts.push({
          parsedAmount,
          isPositive,
          symbol,
          exchangeRate
        });
      }
    }

    const positiveDollarSum = roundFiat(new BigNumber(positiveAmountSum));
    const negativeDollarSum = roundFiat(new BigNumber(negativeAmountSum));

    return { amounts, dollarSums: [positiveDollarSum, negativeDollarSum].filter(sum => !sum.eq(0)) };
  }, [group, getTokenMetadata, exchangeRates]);

  return (
    <View style={styles.container}>
      {nonZeroAmounts.amounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text key={index} style={[styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)]}>
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {symbol}
        </Text>
      ))}

      {nonZeroAmounts.dollarSums.map((amount, index) => (
        <Text
          key={index}
          style={[
            styles.valueText,
            conditionalStyle(amount.isPositive(), styles.positiveAmountText, styles.negativeAmountText)
          ]}>
          {amount.isPositive() ? '+ ' : '- '}
          {amount.abs().toFixed()}
          {' $'}
        </Text>
      ))}
    </View>
  );
};
