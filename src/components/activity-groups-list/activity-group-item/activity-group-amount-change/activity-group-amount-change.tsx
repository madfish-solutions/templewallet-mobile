import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { isDoubleTokenOperation, isSingleTokenOperation } from 'src/utils/activity.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { shortizeSymbol } from 'src/utils/token-metadata.utils';

import { ItemAmountChange } from '../item-amount-change/item-amount-change';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

export enum TextSize {
  Small = 'Small',
  Regular = 'Regular'
}
interface Props {
  textSize?: TextSize;
  nonZeroAmounts: Array<ActivityAmount>;
}

const FIRST_AMOUNT_INDEX = 0;

export const ActivityGroupAmountChange: FC<Props> = ({ nonZeroAmounts, textSize = TextSize.Regular }) => {
  const styles = useActivityGroupAmountChangeStyles();

  const children = useMemo(() => {
    if (nonZeroAmounts.length === 0) {
      return (
        <Text
          style={[
            styles.amountWeight,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
          ]}
        >
          ---
        </Text>
      );
    }

    const { isPositive, parsedAmount, symbol } = nonZeroAmounts[FIRST_AMOUNT_INDEX];

    if (isSingleTokenOperation(nonZeroAmounts)) {
      return (
        <ItemAmountChange
          amount={parsedAmount}
          isPositive={isPositive}
          symbol={symbol}
          textStyle={[
            styles.amountWeight,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
          ]}
        />
      );
    }

    if (isDoubleTokenOperation(nonZeroAmounts)) {
      const symbols = nonZeroAmounts.map(({ symbol }) => symbol).join(',');

      return (
        <Text
          style={[
            styles.amountWeight,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15),
            conditionalStyle(isPositive, styles.positiveAmountText, styles.destructiveAmountText)
          ]}
        >
          {isPositive && '+'}
          {shortizeSymbol(symbols)}
        </Text>
      );
    }

    return (
      <Text
        style={[
          styles.amountWeight,
          conditionalStyle(textSize === TextSize.Small, styles.amountText13),
          conditionalStyle(textSize === TextSize.Regular, styles.amountText15),
          conditionalStyle(isPositive, styles.positiveAmountText, styles.destructiveAmountText)
        ]}
      >
        {isPositive ? '+' : '-'}
        {shortizeSymbol(symbol)} and {nonZeroAmounts.length - 1} others
      </Text>
    );
  }, [nonZeroAmounts, textSize]);

  return <View style={styles.container}>{children}</View>;
};
