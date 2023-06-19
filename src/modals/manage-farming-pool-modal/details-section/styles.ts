import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDetailsSectionStyles = createUseStylesMemoized(({ colors, typography }) => ({
  detailsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  detailsTitleText: {
    ...typography.body15Semibold,
    color: colors.black,
    letterSpacing: formatSize(-0.24)
  },
  farmTypeIconWrapper: {
    padding: formatSize(4),
    borderRadius: formatSize(4),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  quipuswapIconWrapper: {
    backgroundColor: black
  },
  liquidityBakingIconWrapper: {
    backgroundColor: colors.blue
  }
}));
