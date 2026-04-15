import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

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
  },
  loader: {
    marginTop: formatSize(100)
  }
}));
