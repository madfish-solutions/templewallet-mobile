import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useDropdownBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%',
    marginHorizontal: formatSize(8),
    marginBottom: formatSize(34),
    backgroundColor: colors.navigation,
    borderRadius: formatSize(14)
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(12),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  title: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  footerContainer: {
    paddingHorizontal: formatSize(12),
    paddingTop: formatSize(15),
    paddingBottom: formatSize(19)
  },
  cancelButtonText: {
    ...typography.body17Semibold,
    color: colors.orange,
    alignSelf: 'center'
  }
}));
