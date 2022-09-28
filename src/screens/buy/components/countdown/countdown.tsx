import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useCountdownStyles } from './countdown.styles';

interface Props {
  endTimestamp: number;
}

const getReturnValues = (countDown: number) => {
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [minutes, seconds];
};

const addZeroToLowValue = (value: number) => (value > 9 ? value : '0' + value);
const formatOnlyPositive = (value: number) => (value < 0 ? 0 : value);

export const Countdown: FC<Props> = ({ endTimestamp }) => {
  const styles = useCountdownStyles();
  const countDownDate = new Date(endTimestamp).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const [minutes, seconds] = getReturnValues(countDown);

  const minutesLabel = addZeroToLowValue(formatOnlyPositive(minutes));
  const secondsLabel = addZeroToLowValue(formatOnlyPositive(seconds));

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {minutesLabel}:{secondsLabel}
      </Text>
    </View>
  );
};
