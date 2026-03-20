import { createUseStyles } from 'src/styles/create-use-styles';

export const useCountdownStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timerText: {
    ...typography.headline4Regular22,
    color: colors.black
  }
}));
