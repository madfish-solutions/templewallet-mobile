import { createUseStyles } from '../../../styles/create-use-styles';

export const useAboutDelegationScreenStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  text: {
    ...typography.caption11Regular,
    color: colors.black
  },
  link: {
    ...typography.caption11Semibold,
    color: colors.blue,
    textDecorationLine: 'underline'
  }
}));
