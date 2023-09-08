import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { isSingleTokenOperation, separateAmountsBySign } from 'src/utils/activity.utils';
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

    if (isSingleTokenOperation(nonZeroAmounts)) {
      const { isPositive, parsedAmount, symbol } = nonZeroAmounts[FIRST_AMOUNT_INDEX];

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

    const { positiveAmounts, negativeAmounts } = separateAmountsBySign(nonZeroAmounts);

    if (positiveAmounts.length === 0) {
      if (negativeAmounts.length === 0) {
        return null;
      }
      const { symbol, parsedAmount } = negativeAmounts[FIRST_AMOUNT_INDEX];
      if (negativeAmounts.length === 1) {
        return (
          <ItemAmountChange
            amount={parsedAmount}
            isPositive={false}
            symbol={symbol}
            textStyle={[
              styles.amountWeight,
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          />
        );
      }
      if (negativeAmounts.length === 2) {
        const symbols = negativeAmounts.map(({ symbol }) => symbol).join(',');

        return (
          <Text
            style={[
              styles.amountWeight,
              styles.destructiveAmountText,
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          >
            -{shortizeSymbol(symbols)}
          </Text>
        );
      }

      return (
        <Text
          style={[
            styles.amountWeight,
            styles.destructiveAmountText,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
          ]}
        >
          -{shortizeSymbol(symbol)} and {negativeAmounts.length - 1} others
        </Text>
      );
    } else {
      if (positiveAmounts.length === 0) {
        return null;
      }
      const { symbol, parsedAmount } = positiveAmounts[FIRST_AMOUNT_INDEX];
      if (positiveAmounts.length === 1) {
        return (
          <ItemAmountChange
            amount={parsedAmount}
            isPositive
            symbol={symbol}
            textStyle={[
              styles.amountWeight,
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          />
        );
      }
      if (positiveAmounts.length === 2) {
        const symbols = positiveAmounts.map(({ symbol }) => symbol).join(',');

        return (
          <Text
            style={[
              styles.amountWeight,
              styles.destructiveAmountText,
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          >
            +{shortizeSymbol(symbols)}
          </Text>
        );
      }

      return (
        <Text
          style={[
            styles.amountWeight,
            styles.positiveAmountText,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
          ]}
        >
          +{shortizeSymbol(symbol)} and {positiveAmounts.length - 1} others
        </Text>
      );
    }
  }, [nonZeroAmounts, textSize]);

  return <View style={styles.container}>{children}</View>;
};
