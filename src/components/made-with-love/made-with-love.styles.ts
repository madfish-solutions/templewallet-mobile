import { createUseStyles } from '../../styles/create-use-styles';

export const useMadeWithLoveStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
