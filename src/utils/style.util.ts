import { StyleProp, TextProps, TextStyle } from 'react-native';

export const hexa = (hex: string, alpha: number) => hex + alpha * 100;

export const getTruncatedProps = (
  style: StyleProp<TextStyle>,
  ellipsizeMode: TextProps['ellipsizeMode'] = 'tail'
): TextProps => ({
  style: [style, { flexShrink: 1 }],
  numberOfLines: 1,
  ellipsizeMode
});
