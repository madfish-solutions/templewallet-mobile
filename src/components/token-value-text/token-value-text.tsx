import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { TokenInterface } from '../../token/interfaces/token.interface';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';

interface Props {
  token: TokenInterface;
  isShowSymbol?: boolean;
}

export const TokenValueText: FC<Props> = ({ token, isShowSymbol = true }) => {
  const parsedAmount = mutezToTz(new BigNumber(token.balance), token.decimals);

  return (
    <Text>
      {formatAssetAmount(parsedAmount)}
      {isShowSymbol ? ` ${token.symbol}` : null}
    </Text>
  );
};
