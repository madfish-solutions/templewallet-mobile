import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useSwapPercentageStyles = createUseStyles(({ colors, typography }) => ({
  keyboard: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    height: formatSize(44)
    // paddingVertical: formatSize(8),
    // paddingHorizontal: formatSize(16),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: formatSize(8),
    height: formatSize(160),
    width: '100%',
    backgroundColor: colors.blue,
    paddingHorizontal: formatSize(16)
  },
  percentageGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  percentageText: {
    ...typography.tagline13Tag,
    paddingVertical: formatSize(4),
    paddingHorizontal: formatSize(8),
    color: colors.orange
  },
  percentageShape: {
    backgroundColor: colors.white,
    marginRight: formatSize(8),
    borderRadius: formatSize(13),
    height: formatSize(26),
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
