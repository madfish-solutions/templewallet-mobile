import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useDropdownBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%',
    marginHorizontal: formatSize(8),
    marginBottom: formatSize(34),
    backgroundColor: colors.navigation,
    borderRadius: formatSize(14),
    overflow: 'hidden'
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(12),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  title: {
    ...typography.body17Semibold,
    color: colors.black,
    lineHeight: formatTextSize(22),
    marginBottom: formatSize(4)
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    lineHeight: formatTextSize(18),
    textAlign: 'center'
  },
  cancelButton: {
    height: formatSize(56),
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButtonText: {
    ...typography.body17Semibold,
    color: colors.orange,
    paddingBottom: formatSize(4)
  },
  backdrop: {
    backgroundColor: colors.black
  }
}));
