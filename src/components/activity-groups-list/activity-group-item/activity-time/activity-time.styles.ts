import { createUseStyles } from 'src/styles/create-use-styles';

export const useActivityTimeStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.numbersRegular11,
    color: colors.gray2
  }
}));
