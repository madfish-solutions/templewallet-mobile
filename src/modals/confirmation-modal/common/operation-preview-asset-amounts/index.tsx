import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';

import { useOperationPreviewAssetAmountsStyles } from './styles';

interface Props {
  amount: string;
  asset: AssetInterface;
  receiver?: string;
  showMinusSign?: boolean;
  showDollar?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const UNLIMITED_AMOUNT_VALUE = 'Unlimited';

export const OperationPreviewAssetAmounts: FC<Props> = ({
  amount,
  asset,
  receiver,
  showMinusSign = false,
  showDollar = true,
  textStyle
}) => {
  const styles = useOperationPreviewAssetAmountsStyles();

  if (amount === UNLIMITED_AMOUNT_VALUE) {
    return (
      <Text style={[styles.amountToken, textStyle]}>
        {UNLIMITED_AMOUNT_VALUE} {asset.symbol}
      </Text>
    );
  }

  return (
    <>
      <AssetValueText
        amount={amount}
        asset={asset}
        receiver={receiver}
        showMinusSign={showMinusSign}
        style={[styles.amountToken, textStyle]}
      />
      {showDollar && (
        <>
          <Divider size={formatSize(8)} />
          <AssetValueText
            convertToDollar
            amount={amount}
            asset={asset}
            showMinusSign={showMinusSign}
            style={[styles.amountDollar, textStyle]}
          />
        </>
      )}
    </>
  );
};
