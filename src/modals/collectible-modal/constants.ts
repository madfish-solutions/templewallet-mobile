import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const OFFSETS_SIZE = 42;

export const itemWidth = (width - OFFSETS_SIZE) / 2;
