import { DEFAULT_BORDER_WIDTH } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useBakerRewardsListStyles = createUseStyles(({ colors, typography }) => ({
  rewardsContainer: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(20),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  },
  rewardsText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  flatListContentContainer: {
    paddingLeft: formatSize(16)
  }
}));
