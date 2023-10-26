import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { COLLECTIBLE_WIDTH } from '../../constants';

export const useCollectiblePropertiesStyles = createUseStylesMemoized(() => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
}));

export const useCollectiblePropertyStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    width: COLLECTIBLE_WIDTH,
    marginBottom: formatSize(8),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    backgroundColor: colors.cardBG,
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
