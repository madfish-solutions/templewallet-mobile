import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useArtStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: formatSize(48),
    borderRadius: formatSize(4),
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  active: {
    borderWidth: formatSize(2),
    borderColor: colors.peach
  },
  inactive: {
    borderWidth: formatSize(2),
    borderColor: colors.gray4
  },
  iconContainer: {
    position: 'relative',
    height: formatSize(48),
    width: formatSize(48)
  },
  title: {
    paddingHorizontal: formatSize(8),
    ...typography.caption13Regular,
    color: colors.black
  }
}));
