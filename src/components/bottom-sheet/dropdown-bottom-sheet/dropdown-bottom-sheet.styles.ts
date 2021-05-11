import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useDropdownBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%',
    marginHorizontal: formatSize(8)
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(12),
    backgroundColor: colors.navigation,
    borderTopLeftRadius: formatSize(14),
    borderTopRightRadius: formatSize(14),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  title: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  scrollView: {
    backgroundColor: colors.pageBG
  },
  contentContainer: {
    padding: formatSize(8)
  },
  footerContainer: {
    marginBottom: formatSize(34),
    paddingHorizontal: formatSize(12),
    paddingTop: formatSize(15),
    paddingBottom: formatSize(19),
    backgroundColor: colors.navigation,
    borderBottomLeftRadius: formatSize(14),
    borderBottomRightRadius: formatSize(14)
  },
  cancelButtonText: {
    ...typography.body17Semibold,
    color: colors.orange,
    alignSelf: 'center'
  }
}));
