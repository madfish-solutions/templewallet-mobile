import { createUseStyles } from 'src/styles/create-use-styles';

export const useOperationPreviewDescriptionStyles = createUseStyles(({ colors, typography }) => ({
  description: {
    ...typography.caption13Regular,
    color: colors.black,
    flexShrink: 1
  }
}));
