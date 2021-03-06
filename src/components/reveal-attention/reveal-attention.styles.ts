import { createUseStyles } from '../../styles/create-use-styles';

export const useRevealAttentionStyles = createUseStyles(({ colors, typography }) => ({
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
