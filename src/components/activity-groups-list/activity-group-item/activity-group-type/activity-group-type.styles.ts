import { createUseStyles } from 'src/styles/create-use-styles';

export const useActivityGroupTypeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  text: {
    ...typography.caption13Regular,
    color: colors.black,
    flexShrink: 1
  }
}));
