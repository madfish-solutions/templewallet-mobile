import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { FormattedAmount } from '../../../../components/formatted-amount';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';

interface Props {
  amount: BigNumber;
  asset: CurrenciesInterface;
  style?: StyleProp<TextStyle>;
}

export const ExolixAssetValueText: FC<Props> = ({ amount, asset, style }) => {
  return (
    <Text style={style}>
      <FormattedAmount
        amount={amount}
        isDollarValue={false}
        showMinusSign={false}
        showPlusSign={false}
        symbol={asset.code}
        style={style}
      />
    </Text>
  );
};
