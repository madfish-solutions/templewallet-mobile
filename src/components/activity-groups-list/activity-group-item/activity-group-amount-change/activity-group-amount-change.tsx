import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { useTokenMetadata } from '../../../../hooks/use-token-metadata.hook';
import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { formatAssetAmount } from '../../../../utils/number.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupAmountChange: FC<Props> = ({ group }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const { getTokenMetadata } = useTokenMetadata();

  const nonZeroAmounts = useMemo(
    () =>
      group
        .map(({ amount, tokenSlug }) => {
          const { decimals, symbol } = getTokenMetadata(tokenSlug);

          const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
          const isPositive = parsedAmount.isPositive();

          return {
            parsedAmount,
            isPositive,
            symbol
          };
        })
        .filter(({ parsedAmount }) => !parsedAmount.isEqualTo(0)),
    [group, getTokenMetadata]
  );

  const isShowValueText = nonZeroAmounts.length > 0;

  return (
    <View style={styles.container}>
      {nonZeroAmounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text key={index} style={[styles.amountText, conditionalStyle(isPositive, styles.positiveAmountText)]}>
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {symbol}
        </Text>
      ))}

      {isShowValueText && <Text style={styles.valueText}>XX.XX $</Text>}
    </View>
  );
};
