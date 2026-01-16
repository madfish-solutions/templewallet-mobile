import { createUseStyles } from 'src/styles/create-use-styles';

export const useCheckboxIconStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
