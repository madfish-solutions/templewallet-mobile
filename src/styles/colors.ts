import { ThemesEnum } from '../interfaces/theme.enum';
import { hexa } from '../utils/style.util';

const accentColors = {
  orange: '#FF5B00',
  blue: '#007AFF'
};
const accentAlphaColors = {
  orange10: hexa(accentColors.orange, 0.1),
  blue10: hexa(accentColors.blue, 0.1)
};

const basicLightColors = {
  adding: '#34CC4E',
  destructive: '#FF3B30',
  black: '#000000',
  white: '#ffffff'
};

const basicDarkColors: typeof basicLightColors = {
  adding: '#34CC4E',
  destructive: '#FF3B30',
  black: '#ffffff',
  white: '#000000'
};

const basicLightAlphaColors = {
  black10: hexa(basicLightColors.black, 0.1)
};

const basicDarkAlphaColors: typeof basicLightAlphaColors = {
  black10: hexa(basicDarkColors.black, 0.1)
};

const graybaseLightColors = {
  gray1: '#707070',
  gray2: '#AEAEB2',
  gray3: '#C2C2C8',
  gray4: '#F4F4F4'
};
const graybaseDarkColors: typeof graybaseLightColors = {
  gray1: '#9C9C9C',
  gray2: '#848484',
  gray3: '#606060',
  gray4: '#434343'
};

const backgroundLightColors = {
  navigation: '#ffffff',
  pageBG: '#FBFBFB',
  cardBG: '#ffffff',
  lines: '#e4e4e4',
  disabled: '#cbcbcb',
  input: '#f0f0f0',
  toastBG: '#ffffff',
  successToastOverlay: basicLightColors.adding,
  warningToastOverlay: hexa('#FF7A00', 0.1),
  errorToastOverlay: basicLightColors.destructive
};

const backgroundDarkColors: typeof backgroundLightColors = {
  navigation: '#0d0d0d',
  pageBG: '#171717',
  cardBG: '#202020',
  lines: '#000000',
  disabled: '#6F6F6F',
  input: '#2D2D2D',
  toastBG: '#000000',
  successToastOverlay: basicLightColors.adding,
  warningToastOverlay: hexa(basicDarkColors.black, 0.1),
  errorToastOverlay: basicDarkColors.destructive
};

const lightTheme: Record<string, string> = {
  ...accentColors,
  ...accentAlphaColors,
  ...basicLightColors,
  ...basicLightAlphaColors,
  ...graybaseLightColors,
  ...backgroundLightColors
};

export type Colors = Record<keyof typeof lightTheme, string>;

export const getColors = (theme: ThemesEnum): Colors => ({
  ...lightTheme,
  ...(theme === ThemesEnum.dark && {
    ...basicDarkColors,
    ...basicDarkAlphaColors,
    ...graybaseDarkColors,
    ...backgroundDarkColors
  })
});
