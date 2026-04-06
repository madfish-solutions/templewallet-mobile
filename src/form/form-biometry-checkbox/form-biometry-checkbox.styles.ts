import { createUseStyles } from 'src/styles/create-use-styles';

export const useFormBiometryCheckboxStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
