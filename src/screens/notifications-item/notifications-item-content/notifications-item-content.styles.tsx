import { createUseStyles } from 'src/styles/create-use-styles';

export const useNotificationsItemContentStyles = createUseStyles(({ colors, typography }) => ({
  description: {
    ...typography.caption13Regular,
    color: colors.black
  },
  link: {
    ...typography.caption13Regular
  }
}));
