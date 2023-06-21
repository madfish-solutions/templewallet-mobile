import { createUseStyles } from '../../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../../styles/format-size';
import { COLLECTIBLE_WIDTH } from '../../../../constants';

export const useCollectibleAttributeStyles = createUseStyles(({ typography, colors }) => ({
  root: {
    width: COLLECTIBLE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: formatSize(8),
    paddingVertical: formatSize(8),
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    backgroundColor: colors.cardBG,
    borderColor: colors.lines
  },
  name: {
    marginBottom: formatSize(4),
    ...typography.caption13Regular,
    color: colors.gray1
  },
  value: {
    marginBottom: formatSize(4),
    ...typography.body15Semibold,
    color: colors.black
  },
  rarity: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));