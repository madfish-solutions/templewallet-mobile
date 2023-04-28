import { Dimensions } from 'react-native';

import { createUseStyles } from '../../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../../styles/format-size';

const { width } = Dimensions.get('window');
const itemWidth = (width - 42) / 2;

export const useCollectiblePropertyStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    width: itemWidth,
    marginBottom: formatSize(8),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(10)
  },
  name: {
    marginBottom: formatSize(8),
    ...typography.caption13Regular,
    color: colors.gray1
  },
  value: {
    ...typography.numbersMedium17,
    color: colors.black
  }
}));
