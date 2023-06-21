import { createUseStyles } from 'src/styles/create-use-styles';

export const useOnRampTextButtonStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  title: {
    ...typography.tagline13Tag,
    color: colors.peach,
    textTransform: 'uppercase'
  }
}));
