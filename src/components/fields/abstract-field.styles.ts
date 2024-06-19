import { createUseStyles } from 'src/styles/create-use-styles';

export const useAbstractFieldStyles = createUseStyles(({ colors, typography }) => ({
  checkboxContainer: {
    alignItems: 'center'
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
