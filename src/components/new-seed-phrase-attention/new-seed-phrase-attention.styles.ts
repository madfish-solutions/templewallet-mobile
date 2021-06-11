import { createUseStyles } from '../../styles/create-use-styles';

export const useSeedPhraseAttentionStyles = createUseStyles(({ colors, typography }) => ({
  semibold: {
    ...typography.caption13Semibold
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
