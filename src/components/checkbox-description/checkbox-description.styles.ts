import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCheckboxDescriptionStyles = createUseStyles(({ colors, typography }) => ({
  label: {
    ...typography.caption11Regular,
    marginHorizontal: formatSize(4),
    color: colors.gray1
  }
}));
