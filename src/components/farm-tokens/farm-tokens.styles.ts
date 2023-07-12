import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFarmTokensStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    flexDirection: 'row'
  },
  tokensContainer: {
    position: 'relative',
    height: formatSize(36)
  },
  nextToken: {
    marginLeft: formatSize(-8)
  },
  rewardTokenWrapper: {
    position: 'absolute',
    top: formatSize(14),
    right: formatSize(-6),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(12),
    width: formatSize(24),
    height: formatSize(24),
    justifyContent: 'center',
    alignItems: 'center'
  },
  stakeTokenSymbols: {
    ...typography.caption13Semibold,
    color: colors.black,
    maxWidth: formatSize(128)
  },
  rewardTokenSymbol: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
