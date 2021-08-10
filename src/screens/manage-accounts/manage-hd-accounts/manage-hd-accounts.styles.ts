import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useManageHdAccountsStyles = createUseStyles(({ colors, typography }) => ({
  revealSeedPhraseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: formatSize(16)
  },
  revealSeedPhraseText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    flexShrink: 1
  }
}));
