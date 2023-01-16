import { createUseStyles } from '../../../styles/create-use-styles';

export const useContactItemStyles = createUseStyles(({ colors, typography }) => ({
  name: {
    ...typography.numbersRegular15,
    color: colors.black
  }
}));
