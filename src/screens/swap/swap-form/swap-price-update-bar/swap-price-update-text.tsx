import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { formatSize } from '../../../../styles/format-size';
import { useSwapPriceUpdateBarStyles } from './swap-price-update-bar.styles';

interface Props {
  nowTimestamp: number;
  blockEndTimestamp: number;
}

export const SwapPriceUpdateText: FC<Props> = ({ nowTimestamp, blockEndTimestamp }) => {
  const styles = useSwapPriceUpdateBarStyles();

  const text = useMemo(() => {
    const millisecondsLeft = blockEndTimestamp - nowTimestamp;
    const secondsLeft = Math.floor(millisecondsLeft / 1000);

    return isNaN(secondsLeft)
      ? 'Loading...'
      : secondsLeft >= 0
      ? `Rates update in ${secondsLeft}s`
      : `Rates update is late for ${Math.abs(secondsLeft)}s`;
  }, [blockEndTimestamp, nowTimestamp]);

  return (
    <>
      <Text style={styles.progressBarTextStyle}>{text}</Text>
      <Divider size={formatSize(6)} />
    </>
  );
};
