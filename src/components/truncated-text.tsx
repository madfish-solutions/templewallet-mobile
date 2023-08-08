import React, { FC } from 'react';
import { Text, TextProps } from 'react-native';

export const TruncatedText: FC<TextProps> = props => (
  <Text numberOfLines={1} ellipsizeMode="tail" {...props} style={[props.style, { flexShrink: 1 }]} />
);
