import { Dimensions } from 'react-native';

import { createUseStyles } from '../../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../../styles/format-size';

const { width } = Dimensions.get('window');
const itemWidth = (width - 42) / 2;

export const useCollectibleAttributeStyles = createUseStyles(({ typography, colors }) => ({
  root: {
    width: itemWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: formatSize(8),
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: '#E4E4E4'
  },
  name: {
    marginBottom: formatSize(4),
    ...typography.caption13Regular,
    color: colors.gray1
  },
  value: {
    marginBottom: formatSize(4),
    ...typography.body15Semibold
  },
  rarity: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
