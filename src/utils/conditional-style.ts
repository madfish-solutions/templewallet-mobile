import { TextStyle, ViewStyle } from 'react-native';

import { isAndroid, isIOS } from '../config/system';

type StyleType = ViewStyle | TextStyle | undefined;

export const conditionalStyle = (condition: boolean, trueStyle: StyleType, falseStyle?: StyleType): StyleType =>
  condition ? trueStyle : falseStyle;

export const iosStyles = (style: StyleType): StyleType => conditionalStyle(isIOS, style);

export const androidStyles = (style: StyleType): StyleType => conditionalStyle(isAndroid, style);
