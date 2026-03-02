import { createUseStyles } from 'src/styles/create-use-styles';

export const useTextLinkStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption11Semibold,
    color: colors.blue,
    textDecorationLine: 'underline'
  },
  blackText: {
    ...typography.caption11Semibold,
    color: colors.black,
    textDecorationLine: 'underline'
  }
}));
