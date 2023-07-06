import React, { FC } from 'react';
import { View, Text, ViewStyle } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { useBageStyles } from './bage.styles';

interface Props {
  text: string;
  color?: string;
  style?: ViewStyle;
}

export const Bage: FC<Props> = ({ text, color, style }) => {
  const styles = useBageStyles();

  return (
    <View style={[style, styles.root, conditionalStyle(isDefined(color), { backgroundColor: color })]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
