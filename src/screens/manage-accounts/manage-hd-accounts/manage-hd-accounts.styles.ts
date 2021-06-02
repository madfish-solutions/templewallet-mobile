import { createUseStyles } from '../../../styles/create-use-styles';

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
  }
}));
