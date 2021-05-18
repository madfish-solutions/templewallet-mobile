import { TextStyle, ViewStyle } from 'react-native';

type ButtonContainerStyle = Required<Pick<ViewStyle, 'height' | 'borderRadius'>> & Pick<ViewStyle, 'borderWidth'>;
type ButtonTitleStyle = Required<Pick<TextStyle, 'fontSize' | 'fontFamily'>>;

type ButtonIconStyle = {
  size: number;
  marginRight: number;
};

type ButtonColorConfig = {
  titleColor: string;
  iconColor?: string;
  backgroundColor: string;
  borderColor?: string;
};

export type ButtonStyleConfig = {
  containerStyle: ButtonContainerStyle;
  titleStyle?: ButtonTitleStyle;
  iconStyle?: ButtonIconStyle;
  activeColorConfig: ButtonColorConfig;
  disabledColorConfig?: ButtonColorConfig;
};
