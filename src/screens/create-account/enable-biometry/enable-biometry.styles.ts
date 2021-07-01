import { createUseStyles } from '../../../styles/create-use-styles';

export const useEnableBiometryStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  prompt: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
