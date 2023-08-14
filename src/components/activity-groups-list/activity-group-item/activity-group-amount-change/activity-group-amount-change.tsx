import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { shortizeSymbol } from 'src/utils/token-metadata.utils';

import { NonZeroAmounts } from '../../../../interfaces/non-zero-amounts.interface';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { formatAssetAmount } from '../../../../utils/number.util';
import { useActivityGroupAmountChangeStyles } from './activity-group-amount-change.styles';

export enum TextSize {
  Small = 'Small',
  Regular = 'Regular'
}
interface Props {
  textSize?: TextSize;
  nonZeroAmounts: NonZeroAmounts;
}

export const ActivityGroupAmountChange: FC<Props> = ({ nonZeroAmounts, textSize = TextSize.Regular }) => {
  const styles = useActivityGroupAmountChangeStyles();

  return (
    <View style={styles.container}>
      {nonZeroAmounts.amounts.map(({ parsedAmount, isPositive, symbol }, index) => (
        <Text
          key={index}
          style={[
            styles.amountWeight,
            conditionalStyle(textSize === TextSize.Small, styles.amountText13),
            conditionalStyle(textSize === TextSize.Regular, styles.amountText15),
            conditionalStyle(isPositive, styles.positiveAmountText, styles.destructiveAmountText)
          ]}
        >
          {isPositive && '+'}
          {formatAssetAmount(parsedAmount)} {shortizeSymbol(symbol)}
        </Text>
      ))}
    </View>
  );
};
