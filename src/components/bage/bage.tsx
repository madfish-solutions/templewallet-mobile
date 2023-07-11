import React, { FC } from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { useBageStyles } from './bage.styles';

interface Props {
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Bage: FC<Props> = ({ text, color, style, textStyle }) => {
  const styles = useBageStyles();

  return (
    <View style={[style, styles.root, conditionalStyle(isDefined(color), { backgroundColor: color })]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};
