import { createUseStyles } from 'src/styles/create-use-styles';

export const useSwapDisclaimerStyles = createUseStyles(({ typography, colors }) => ({
  container: {
    flexDirection: 'row'
  },
  link: {
    ...typography.caption13Semibold,
    color: colors.black,
    textDecorationLine: 'underline'
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
