import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderCloseOptionsButtonStyles = createUseStyles(({ colors }) => ({
  accountActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    paddingVertical: formatSize(6),
    paddingHorizontal: formatSize(8),
    marginRight: formatSize(8)
  },
  verticalLineDivider: {
    width: formatSize(1),
    height: formatSize(12),
    backgroundColor: colors.lines,
    marginHorizontal: formatSize(8)
  }
}));
