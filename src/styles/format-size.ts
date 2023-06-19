import { Dimensions } from 'react-native';

import { layoutScale } from '../config/styles';

export const formatTextSize = (size: number) => (size * layoutScale) / Dimensions.get('window').fontScale;
export const formatSize = (size: number): number => size * layoutScale;
