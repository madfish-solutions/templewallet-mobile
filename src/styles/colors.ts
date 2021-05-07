import { ThemesEnum } from '../interfaces/theme.enum';

export const getColors = (theme: ThemesEnum): Colors => ({
  ...baseColors,
  ...(theme === ThemesEnum.light && darkGray)
});

export type Colors = {
  [key in keyof typeof baseColors]: string;
};

const baseColors = {
  blue: '#007AFF',
  blue10: 'rgba(0, 122, 255, 0.1)',
  orange: '#FF5B00',
  orange10: 'rgba(255, 122, 0, 0.1)',
  adding: '#34CC4E',
  destructive: '#FF3B30',
  black: '#000000',
  white: '#ffffff',
  lightNavigation: '#ffffff',
  lightPageBG: '#FBFBFB',
  lightCardBG: '#ffffff',
  lightLines: '#e4e4e4',
  lightDisabled: '#cbcbcb',
  lightInput: '#f0f0f0',
  darkNavigation: '#0d0d0d',
  darkPageBG: '#171717',
  darkCardBG: '#202020',
  darkLines: '#000000',
  darkDisabled: '#6F6F6F',
  darkInput: '#2D2D2D',
  gray1: '#707070',
  gray2: '#AEAEB2',
  gray3: '#C2C2C8',
  gray4: '#F4F4F4'
};

const darkGray = {
  gray1: '#9C9C9C',
  gray2: '#848484',
  gray3: '#606060',
  gray4: '#434343'
};
