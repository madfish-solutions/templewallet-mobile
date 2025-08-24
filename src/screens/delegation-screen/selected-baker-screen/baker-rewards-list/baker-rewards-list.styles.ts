import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useBakerRewardsListStyles = createUseStyles(({ colors, typography }) => ({
  rewardsContainer: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(20),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  rewardsText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  flatListContentContainer: {
    paddingLeft: formatSize(16)
  },
  loader: {
    marginTop: formatSize(100)
  }
}));
