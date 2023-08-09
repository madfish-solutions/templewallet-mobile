import React, { FC } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

type Props = Pick<TextProps, 'ellipsizeMode' | 'style'>;

const STYLE: StyleProp<TextStyle> = { flexShrink: 1 };

export const TruncatedText: FC<Props> = ({ ellipsizeMode = 'tail', style }) => (
  <Text numberOfLines={1} ellipsizeMode={ellipsizeMode} style={[style, STYLE]} />
);
