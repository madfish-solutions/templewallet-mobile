import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDropdownBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%',
    marginHorizontal: formatSize(8),
    marginBottom: formatSize(34),
    backgroundColor: colors.navigation,
    borderRadius: formatSize(14)
  },
  headerContainer: {
    height: formatSize(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  title: {
    ...typography.caption13Regular,
    color: colors.gray1
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
  }
}));
