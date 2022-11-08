import React, { FC } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';

import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getDollarValue } from '../../utils/balance.utils';
import { isDefined } from '../../utils/is-defined';
import { FormattedAmount } from '../formatted-amount';

interface Props {
  amount: string;
  asset: TokenMetadataInterface;
  style?: StyleProp<TextStyle>;
  showMinusSign?: boolean;
  showSymbol?: boolean;
  convertToDollar?: boolean;
}

export const AssetValueText: FC<Props> = ({
  amount,
  asset,
  style,
  showMinusSign = false,
  showSymbol = true,
  convertToDollar = false
}) => {
  const { isDcpNode } = useNetworkInfo();

  const hideText = convertToDollar && (!isDefined(asset.exchangeRate) || isDcpNode);

  const visibleAmount = getDollarValue(amount, asset, convertToDollar ? asset.exchangeRate : 1);
  const visibleSymbol = showSymbol ? asset.symbol : undefined;

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
