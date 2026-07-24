import { useWindowDimensions } from 'react-native';

export const useMaxDropdownHeight = () => 0.78 * useWindowDimensions().height;
