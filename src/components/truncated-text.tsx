import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type Props = Pick<TextProps, 'ellipsizeMode' | 'style'>;

const STYLE: StyleProp<TextStyle> = { flexShrink: 1 };

export const TruncatedText: FCWithChildren<Props> = ({ ellipsizeMode = 'tail', style, children }) => (
  <Text numberOfLines={1} ellipsizeMode={ellipsizeMode} style={[style, STYLE]}>
    {children}
  </Text>
);
