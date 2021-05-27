import { createUseStyles } from '../../../styles/create-use-styles';

export const useHeaderTitleStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
