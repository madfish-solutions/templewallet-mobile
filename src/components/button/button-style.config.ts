import { TextStyle, ViewStyle } from 'react-native';

type ButtonContainerStyle = Required<Pick<ViewStyle, 'height' | 'borderRadius'>> & Pick<ViewStyle, 'borderWidth'>;
type ButtonTitleStyle = Required<Pick<TextStyle, 'fontSize' | 'fontWeight'>>;

type ButtonIconStyle = {
  iconSize: number;
  iconMarginRight: number;
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
  iconStyle: ButtonIconStyle;
  activeColorConfig: ButtonColorConfig;
  disabledColorConfig?: ButtonColorConfig;
};
