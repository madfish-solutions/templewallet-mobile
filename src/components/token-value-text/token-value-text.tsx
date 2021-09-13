import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';

interface Props {
  token: TokenMetadataInterface;
  amount: string;
  isShowSymbol?: boolean;
  style?: StyleProp<TextStyle>;
  isNegativeAmount?: boolean;
}

export const TokenValueText: FC<Props> = ({ style, token, isShowSymbol = true, amount, isNegativeAmount = false }) => {
  const parsedAmount = mutezToTz(new BigNumber(amount), token.decimals);

  return (
    <Text style={style}>
      {isNegativeAmount && '- '}
      {formatAssetAmount(parsedAmount)}
      {isShowSymbol ? ` ${token.symbol}` : null}
    </Text>
  );
};
