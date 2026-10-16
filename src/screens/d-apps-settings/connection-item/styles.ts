import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useConnectionItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    minHeight: formatSize(66),
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8),
    paddingLeft: formatSize(12),
    paddingRight: formatSize(12),
    paddingVertical: formatSize(12),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    boxShadow: iosCardShadow
  },
  logo: {
    borderRadius: formatSize(18),
    borderWidth: 0
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: formatSize(2)
  },
  name: {
    ...typography.body15Semibold,
    lineHeight: formatSize(20),
    color: colors.black
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(2)
  },
  networkLabel: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1
  }
}));
