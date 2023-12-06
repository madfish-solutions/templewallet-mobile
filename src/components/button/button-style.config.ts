import { Animated, TextStyle, ViewStyle } from 'react-native';

type ButtonContainerStyle = Required<Pick<ViewStyle, 'height' | 'borderRadius'>> & Pick<ViewStyle, 'borderWidth'>;
type ButtonTitleStyle = Required<Pick<TextStyle, 'fontSize' | 'fontFamily'>>;

type ButtonIconStyle = {
  size: number;
  marginRight: number;
  translateY?: Animated.Value;
};

type ButtonColorConfig = {
  titleColor: string;
  iconColor?: string;
  backgroundColor: string;
  borderColor?: string;
};

export interface ButtonStyleConfig {
  containerStyle: ButtonContainerStyle;
  titleStyle?: ButtonTitleStyle;
  iconStyle?: ButtonIconStyle;
  activeColorConfig: ButtonColorConfig;
  disabledColorConfig?: ButtonColorConfig;
}
