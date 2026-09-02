import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';
import { hexa } from 'src/utils/style.util';

export const useContactItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    minHeight: formatSize(66),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: formatSize(4),
    marginHorizontal: formatSize(16),
    marginBottom: formatSize(8),
    paddingLeft: formatSize(12),
    paddingRight: formatSize(16),
    paddingVertical: formatSize(12),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    boxShadow: iosCardShadow
  },
  accountContainer: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(6)
  },
  accountContainerData: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    alignItems: 'flex-start'
  },
  name: {
    ...typography.body15Semibold,
    lineHeight: formatSize(20),
    color: colors.black
  },
  address: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1
  },
  hiddenRoot: {
    flex: 1,
    minHeight: formatSize(66),
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: formatSize(16),
    marginBottom: formatSize(8)
  },
  deleteButton: {
    borderRadius: formatSize(8),
    backgroundColor: hexa(colors.destructive, 0.1)
  }
}));
