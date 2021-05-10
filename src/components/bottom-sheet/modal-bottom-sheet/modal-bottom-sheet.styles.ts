import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const closeIconSize = formatSize(28);

export const useModalBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%'
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: formatSize(16),
    backgroundColor: colors.cardBG,
    borderTopLeftRadius: formatSize(10),
    borderTopRightRadius: formatSize(10),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  iconSubstitute: {
    width: closeIconSize,
    height: closeIconSize
  },
  title: {
    ...typography.body17Semibold,
    color: colors.black
  },
  contentContainer: {
    flex: 1,
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16)
  }
}));
