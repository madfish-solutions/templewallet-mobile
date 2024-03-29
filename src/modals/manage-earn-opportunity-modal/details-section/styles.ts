import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDetailsSectionStyles = createUseStylesMemoized(({ colors, typography }) => ({
  detailsTitle: {
    paddingHorizontal: formatSize(4),
    flexDirection: 'row',
    alignItems: 'center'
  },
  farmTypeIconWrapper: {
    padding: formatSize(4),
    borderRadius: formatSize(4),
    backgroundColor: colors.black,
    border: formatSize(0.5),
    borderColor: colors.lines
  },
  youvesIconWrapper: {
    borderRadius: formatSize(6),
    border: formatSize(0.5),
    borderColor: colors.lines,
    backgroundColor: colors.darkGreen
  },
  detailsTitleText: {
    ...typography.body15Semibold,
    color: colors.black,
    letterSpacing: formatSize(-0.24)
  },
  quipuswapIconWrapper: {
    backgroundColor: black
  },
  liquidityBakingIconWrapper: {
    backgroundColor: colors.blue
  }
}));
