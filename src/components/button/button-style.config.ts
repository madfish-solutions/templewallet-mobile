import { Animated, TextStyle, ViewStyle } from 'react-native';

type ButtonContainerStyle = Required<Pick<ViewStyle, 'height' | 'borderRadius'>> & Pick<ViewStyle, 'borderWidth'>;
type ButtonTitleStyle = Required<Pick<TextStyle, 'fontSize' | 'fontFamily'>>;

// TODO: Remove generic parameter after complete migration to new icon system
type ButtonIconStyle<Size extends number> = {
  size: Size;
  marginRight: number;
  translateY?: Animated.Value;
};

type ButtonColorConfig = {
  titleColor: string;
  iconColor?: string;
  backgroundColor: string;
  borderColor?: string;
};

// TODO: Remove generic parameter after complete migration to new icon system
export interface ButtonStyleConfig<Size extends number = number> {
  containerStyle: ButtonContainerStyle;
  titleStyle?: ButtonTitleStyle;
  iconStyle?: ButtonIconStyle<Size>;
  activeColorConfig: ButtonColorConfig;
  disabledColorConfig?: ButtonColorConfig;
}
