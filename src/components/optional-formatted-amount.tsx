import BigNumber from 'bignumber.js';
import React, { memo, ReactNode, useMemo } from 'react';
import { Text } from 'react-native';

import { FormattedAmount, FormattedAmountProps } from './formatted-amount';

interface OptionalFormattedAmountProps extends Omit<FormattedAmountProps, 'amount'> {
  amount?: BigNumber;
  renderLoader?: () => ReactNode;
}

export const OptionalFormattedAmount = memo<OptionalFormattedAmountProps>(
  ({ amount, renderLoader, style, ...restProps }) => {
    const Loader = useMemo(() => renderLoader ?? (() => <Text style={style}>---</Text>), [renderLoader, style]);

    return amount && !amount.isNaN() ? <FormattedAmount amount={amount} style={style} {...restProps} /> : <Loader />;
  }
);
