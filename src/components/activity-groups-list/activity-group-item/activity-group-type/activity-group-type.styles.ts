import { createUseStyles } from '../../../../styles/create-use-styles';

export const useActivityGroupTypeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
