import { clamp } from 'lodash-es';
import { Dimensions } from 'react-native';

const basicScreenWidth = 375;
const maxLayoutScale = 1.1;
export const layoutScale = clamp(Dimensions.get('screen').width / basicScreenWidth, maxLayoutScale);

export const greyLight = '#707070';
export const greyLight200 = '#E5E5EA';
export const greyLight400 = '#F4F4F4';
export const blue = '#1373E4';
export const black = '#000000';
export const orange = '#FF5B00';
export const orangeLight = '#FF7A00';
export const orangeLight200 = '#FF3D00';
export const darkOrange = 'rgba(255, 122, 0, 0.1)';
export const white = '#FFFFFF';
export const red = 'red';
export const transparent = 'transparent';

export const SIDEBAR_WIDTH = 200;
