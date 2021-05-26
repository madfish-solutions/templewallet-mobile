import { createUseStyles } from '../../../styles/create-use-styles';

export const useModalHeaderTitleStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
