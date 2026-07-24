import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useOptionsPopupStyles = createUseStylesMemoized(({ colors, typography }) => ({
  popoverBackground: {
    backgroundColor: 'transparent'
  },
  popover: {
    width: formatSize(207),
    borderRadius: formatSize(12),
    backgroundColor: colors.navigation,
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderBottomColor: colors.lines
  },
  title: {
    ...typography.caption13Regular,
    backgroundColor: colors.cardBG,
    paddingVertical: formatSize(13),
    textAlign: 'center',
    color: colors.gray1
  },
  option: {
    backgroundColor: colors.pageBG,
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8),
    borderTopWidth: formatSize(1),
    borderColor: colors.lines
  }
}));
