import { Dimensions } from 'react-native';

import { layoutScale } from '../config/styles';

export const formatSize = (size: number): number => Math.round(size * layoutScale);
export const formatSizeScaled = (size: number): number => size * layoutScale * Dimensions.get('window').fontScale;
export const formatTextSize = (size: number) => (size * layoutScale) / Dimensions.get('window').fontScale;
