import { createUseStyles } from 'src/styles/create-use-styles';

export const useFiatSettingsStyles = createUseStyles(({ colors, typography }) => ({
  label: {
    ...typography.body15Regular,
    color: colors.black,
    flex: 1
  }
}));
