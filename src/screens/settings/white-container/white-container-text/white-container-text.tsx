import React, { FC } from 'react';
import { Text } from 'react-native';

import { useWhiteContainerTextStyles } from './white-container-text.styles';

interface Props {
  text: string;
}

export const WhiteContainerText: FC<Props> = ({ text }) => {
  const styles = useWhiteContainerTextStyles();

  return <Text style={styles.text}>{text}</Text>;
};
