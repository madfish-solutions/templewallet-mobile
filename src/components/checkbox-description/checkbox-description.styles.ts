import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCheckboxDescriptionStyles = createUseStyles(({ colors, typography }) => ({
  label: {
    ...typography.caption11Regular,
    marginHorizontal: formatSize(4),
    color: colors.gray1
  }
}));
