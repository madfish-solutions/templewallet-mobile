import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useAddressCardStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    backgroundColor: colors.cardBG,
    padding: formatSize(16),
    borderRadius: formatSize(10),
    gap: formatSize(8)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4)
  },
  headerTitle: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: formatSize(8)
  },
  address: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.gray1,
    marginRight: formatSize(16),
    flex: 1
  },
  actionButton: {
    flex: 0,
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8),
    padding: formatSize(10)
  },
  actionIcon: {
    color: colors.blue
  },
  warningContainer: {
    backgroundColor: colors.peach10,
    borderRadius: formatSize(8),
    padding: formatSize(8),
    paddingBottom: formatSize(10),
    flexDirection: 'row',
    gap: formatSize(8),
    alignItems: 'flex-end'
  },
  warningText: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18),
    color: colors.black
  }
}));
