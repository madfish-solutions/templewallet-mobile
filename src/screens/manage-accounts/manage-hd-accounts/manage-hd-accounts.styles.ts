import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageHdAccountsStyles = createUseStyles(({ colors, typography }) => ({
  revealSeedPhraseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: formatSize(16),
    paddingVertical: formatSize(16)
  },
  revealSeedPhraseText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    flexShrink: 1
  },
  scrollableContentContainer: {
    paddingTop: formatSize(16)
  }
}));
