import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFarmTokensStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    flexDirection: 'row'
  },
  tokensContainer: {
    position: 'relative'
  },
  tokenB: {
    marginLeft: formatSize(-8)
  },
  rewardToken: { position: 'absolute', bottom: 0, right: formatSize(-8) },
  stakeTokenSymbols: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  rewardTokenSymbol: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
