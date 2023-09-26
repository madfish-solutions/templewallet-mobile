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
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black40
  },
  label: {
    paddingVertical: formatSize(2),
    paddingHorizontal: formatSize(4),
    backgroundColor: colors.blue,
    borderRadius: formatSize(8)
  },
  labelText: {
    color: colors.white,
    ...typography.numbersMedium11,
    textTransform: 'uppercase'
  },
  title: {
    paddingHorizontal: formatSize(8),
    ...typography.caption13Regular,
    color: colors.black
  },
  disabledTitle: {
    color: colors.gray3
  }
}));
