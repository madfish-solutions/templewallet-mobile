import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { InterfaceDisclaimer } from 'src/components/interface-disclaimer/interface-disclaimer';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { EvmSwapAsset, EvmSwapQuote } from 'src/types/evm-swap';
import { EVM_SWAP_FEE_PERCENT } from 'src/utils/evm/swap.utils';

interface Props {
  quote: EvmSwapQuote;
  input: EvmSwapAsset;
  output: EvmSwapAsset;
}

export const EvmSwapDetails: FC<Props> = ({ quote, input, output }) => {
  const styles = useStyles();
  const route = quote.route;
  const inputAmount = new BigNumber(route.fromAmount).shiftedBy(-input.decimals);
  const outputAmount = new BigNumber(route.toAmount).shiftedBy(-output.decimals);
  const minimum = new BigNumber(route.toAmountMin).shiftedBy(-output.decimals);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Provider: 3Route</Text>
      <Text style={styles.text}>
        {input.symbol} → {output.symbol}
      </Text>
      <Text style={styles.text}>
        1 {input.symbol} = {outputAmount.dividedBy(inputAmount).toFixed(8)} {output.symbol}
      </Text>
      <Text style={styles.text}>Routes: {route.stepsCount}</Text>
      <Text style={styles.text}>Fee: {EVM_SWAP_FEE_PERCENT}%</Text>
      <Text style={styles.text}>
        Minimum received: {minimum.toFixed()} {output.symbol}
      </Text>
      <Divider size={formatSize(12)} />
      <InterfaceDisclaimer linkText="3Route DEX aggregator" url="https://3route.io/" />
    </View>
  );
};

const useStyles = createUseStyles(({ colors, typography }) => ({
  container: { paddingVertical: formatSize(16), gap: formatSize(8) },
  text: { ...typography.numbersRegular13, color: colors.black }
}));
