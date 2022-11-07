import { createUseStyles } from '../../styles/create-use-styles';

export const useVerifySeedPhraseStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  content: {
    flexGrow: 1
  }
}));
