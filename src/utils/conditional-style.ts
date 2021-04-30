import { TextStyle, ViewStyle } from 'react-native';

type StyleType = ViewStyle | TextStyle;

export const conditionalStyle = (condition: boolean, trueStyle: StyleType, falseStyle?: StyleType): StyleType =>
  condition ? trueStyle : falseStyle ?? {};
