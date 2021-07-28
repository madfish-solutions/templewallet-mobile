import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
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
import { formatAssetAmount } from '../../../../utils/number.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupAmountChange: FC<Props> = ({ group }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const { exchangeRates } = useExchangeRatesSelector();

  const nonZeroAmounts = useMemo(() => {
    const amounts = [];
    let positiveAmountSum = 0;

    for (const { address, id, amount } of group) {
      const { decimals, symbol, name } = getTokenMetadata(getTokenSlug({ address, id }));
      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: id ?? 0 }));
      }

      const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
      const isPositive = parsedAmount.isPositive();
      let exchangeRate = 0;

      if (isString(address)) {
        exchangeRate = exchangeRates.data[address];
      } else if (name === TEZ_TOKEN_METADATA.name) {
        exchangeRate = exchangeRates.data[TEZ_TOKEN_METADATA.name];
      }

      if (isPositive && isDefined(exchangeRate)) {
        positiveAmountSum += parsedAmount.toNumber() * exchangeRate;
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
