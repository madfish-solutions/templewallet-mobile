import { createUseStyles } from 'src/styles/create-use-styles';

export const useSwapDisclaimerStyles = createUseStyles(({ typography }) => ({
  container: {
    flexDirection: 'row'
  },
  link: {
    ...typography.caption13Semibold,
    textDecorationLine: 'underline'
  }
}));
