import { createUseStyles } from 'src/styles/create-use-styles';

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
