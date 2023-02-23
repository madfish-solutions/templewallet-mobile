import { useWindowDimensions } from 'react-native';

export const useDropdownHeight = () => 0.7 * useWindowDimensions().height;
