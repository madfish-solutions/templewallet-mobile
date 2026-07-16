import { isIOS } from 'src/config/system';
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
    alignItems: 'center',
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(1),
    flexDirection: 'row'
  },
  headerTextsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  headerLeftSide: {
    flex: 1
  },
  headerRightSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  closeButton: {
    backgroundColor: colors.peach10,
    borderRadius: formatSize(100)
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
    backgroundColor: colors.black,
    zIndex: isIOS ? 11 : undefined
  },
  bottomSheetContainer: {
    zIndex: isIOS ? 11 : undefined
  }
}));
