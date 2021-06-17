import { createUseStyles } from '../../../styles/create-use-styles';

export const useAboutDelegationScreenStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    alignItems: 'center'
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    textAlign: 'center'
  },
  text: {
    ...typography.caption11Regular,
    color: colors.black,
    textAlign: 'center'
  },
  buttonLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));
