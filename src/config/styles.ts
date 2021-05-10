import { clamp } from 'lodash-es';
import { Dimensions } from 'react-native';

const basicScreenWidth = 375;
const maxLayoutScale = 1.1;
const layoutScale = clamp(Dimensions.get('screen').width / basicScreenWidth, maxLayoutScale);

export const step = 8 * layoutScale;

export const greyLight = '#707070';
export const greyLight200 = '#E5E5EA';
export const blue = '#007AFF';
export const black = '#000000';
export const orange = '#FF5B00';
export const orangeLight = '#FF7A00';
export const orangeLight200 = '#FF3D00';
export const darkOrange = 'rgba(255, 122, 0, 0.1)';
export const white = '#FFFFFF';
export const red = 'red';
export const transparent = 'transparent';
export const borderColor = '#E4E4E4';
export const pageBgColor = '#FBFBFB';

// Use https://ethercreative.github.io/react-native-shadow-generator/
export const generateShadow = (shadowColor: string) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  elevation: 2
});
