import { createUseStyles } from '../../styles/create-use-styles';

export const useFormBiometryCheckboxStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
