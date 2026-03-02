import { createUseStyles } from 'src/styles/create-use-styles';

export const useDisclaimerStyles = createUseStyles(({ colors, typography }) => ({
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
