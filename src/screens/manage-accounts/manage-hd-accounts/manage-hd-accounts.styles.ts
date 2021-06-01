import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useManageHdAccountsStyles = createUseStyles(({ colors, typography }) => ({
  revealSeedPhraseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  revealSeedPhraseText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    flexShrink: 1
  },
  addAccountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  addAccountText: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(2)
  }
}));
