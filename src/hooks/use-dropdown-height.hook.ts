import { useWindowDimensions } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const useDropdownHeight = () => Math.min(0.8 * useWindowDimensions().height, formatSize(646));
