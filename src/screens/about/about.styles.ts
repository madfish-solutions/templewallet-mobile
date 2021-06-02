import { createUseStyles } from '../../styles/create-use-styles';

export const useAboutStyles = createUseStyles(({ colors, typography }) => ({
  templeWalletText: {
    ...typography.caption11Regular,
    color: colors.orange
  },
  openSourceText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
