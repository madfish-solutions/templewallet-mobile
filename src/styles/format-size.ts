import { Dimensions } from 'react-native';

import { isAndroid } from 'src/config/system';

import { layoutScale } from '../config/styles';

export const formatSize = (size: number): number => (isAndroid ? Math.floor(size * layoutScale) : size * layoutScale);
export const formatSizeScaled = (size: number): number => size * layoutScale * Dimensions.get('window').fontScale;
