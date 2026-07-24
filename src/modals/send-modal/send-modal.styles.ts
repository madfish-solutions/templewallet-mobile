import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSendModalStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: formatSize(12)
  },
  filterChip: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8),
    marginRight: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(18),
    backgroundColor: colors.pageBG
  },
  filterChipSelected: {
    borderColor: colors.orange,
    backgroundColor: colors.orange
  },
  filterChipText: {
    ...typography.caption11Regular,
    color: colors.black
  },
  filterChipTextSelected: {
    color: colors.white
  }
}));
