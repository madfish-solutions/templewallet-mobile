import { createUseStyles } from '../../../styles/create-use-styles';

export const useInfoTextStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
