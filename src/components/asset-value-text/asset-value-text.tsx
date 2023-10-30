import React, { FC } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';

import { FormattedAmount } from '../formatted-amount';

interface Props {
  amount: string;
  asset: TokenInterface;
  style?: StyleProp<TextStyle>;
  showMinusSign?: boolean;
  showSymbol?: boolean;
  receiver?: string;
  convertToDollar?: boolean;
}

export const AssetValueText: FC<Props> = ({
  amount,
  asset,
  style,
  showMinusSign = false,
  showSymbol = true,
  receiver,
  convertToDollar = false
}) => {
  const { isDcpNode } = useNetworkInfo();

  const hideText = convertToDollar && (!isDefined(asset.exchangeRate) || isDcpNode);

  const visibleAmount = getDollarValue(amount, asset.decimals, convertToDollar ? asset.exchangeRate : 1);
  const isBurnReceiverAddress = receiver === BURN_ADDRESS;
  const visibleSymbol = showSymbol ? (isBurnReceiverAddress ? asset.name : asset.symbol) : undefined;

  return (
    <>
      {hideText ? (
        <Text style={style} />
      ) : (
        <FormattedAmount
          amount={visibleAmount}
          isDollarValue={convertToDollar}
          showMinusSign={showMinusSign}
          showPlusSign={false}
          symbol={visibleSymbol}
          style={style}
        />
      )}
    </>
  );
};
