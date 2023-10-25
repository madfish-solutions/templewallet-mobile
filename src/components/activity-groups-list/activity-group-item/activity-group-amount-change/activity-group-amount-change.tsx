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
            styles.black,
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

    if (positiveAmounts.length === 0 && negativeAmounts.length === 0) {
      return null;
    }

    const isPositiveAmount = positiveAmounts.length > 0;
    const source = isPositiveAmount ? positiveAmounts : negativeAmounts;
    const { symbol, parsedAmount } = source[FIRST_AMOUNT_INDEX];

    switch (source.length) {
      case 1:
        return (
          <ItemAmountChange
            amount={parsedAmount}
            isPositive={isPositiveAmount}
            symbol={symbol}
            textStyle={[
              styles.amountWeight,
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          />
        );
      case 2:
        const symbols = source.map(({ symbol }) => symbol).join(', ');

        return (
          <Text
            style={[
              styles.amountWeight,
              conditionalStyle(isPositiveAmount, styles.positiveAmountText, styles.destructiveAmountText),
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          >
            {isPositiveAmount ? '+' : '-'}
            {shortizeSymbol(symbols)}
          </Text>
        );

      default:
        return (
          <Text
            style={[
              styles.amountWeight,
              conditionalStyle(isPositiveAmount, styles.positiveAmountText, styles.destructiveAmountText),
              conditionalStyle(textSize === TextSize.Small, styles.amountText13),
              conditionalStyle(textSize === TextSize.Regular, styles.amountText15)
            ]}
          >
            {isPositiveAmount ? '+' : '-'}
            {shortizeSymbol(symbol)} and {source.length - 1} others
          </Text>
        );
    }
  }, [nonZeroAmounts, textSize]);

  return <View style={styles.container}>{children}</View>;
};
