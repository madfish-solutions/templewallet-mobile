import { BigNumber } from 'bignumber.js';
import { clamp, inRange } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTokenMetadataGetter } from '../../../../hooks/use-token-metadata-getter.hook';
import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { useExchangeRatesSelector } from '../../../../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../../../../store/wallet/wallet-actions';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { isDefined } from '../../../../utils/is-defined';
import { isString } from '../../../../utils/is-string';
import { formatAssetAmount, roundFiat } from '../../../../utils/number.util';
import { getTruncatedProps } from '../../../../utils/style.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

const MIN_POSITIVE_AMOUNT_VALUE = 0.01;
const MAX_NEGATIVE_AMOUNT_VALUE = -0.01;

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

    return { amounts, dollarSums: [positiveAmountSum, negativeAmountSum].filter(sum => sum !== 0) };
  }, [group, getTokenMetadata, exchangeRates]);

  return (
    <View style={styles.container}>
      {nonZeroAmounts.amounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text
          key={index}
          {...getTruncatedProps([styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)])}>
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {symbol}
        </Text>
      ))}

      {nonZeroAmounts.dollarSums.map((amount, index) => (
        <Text
          key={index}
          style={[
            styles.valueText,
            conditionalStyle(amount > 0, styles.positiveAmountText, styles.negativeAmountText)
          ]}
        >
          {inRange(amount, MAX_NEGATIVE_AMOUNT_VALUE, MIN_POSITIVE_AMOUNT_VALUE) && '≈ '}
          {amount > 0 ? '+ ' : '- '}
          {roundFiat(
            new BigNumber(
              amount > 0 ? clamp(amount, MIN_POSITIVE_AMOUNT_VALUE, Infinity) : clamp(amount, MAX_NEGATIVE_AMOUNT_VALUE)
            ).abs()
          ).toFixed()}
          {' $'}
        </Text>
      ))}
    </View>
  );
};
