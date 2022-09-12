import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const usePercentageSelectorStyles = createUseStyles(({ colors, typography }) => ({
  keyboard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: formatSize(44)
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: formatSize(8),
    height: formatSize(252),
    width: '100%',
    backgroundColor: colors.pageBG,
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
