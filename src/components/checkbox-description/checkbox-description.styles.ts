import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCheckboxDescriptionStyles = createUseStyles(({ colors, typography }) => ({
  labelContainer: {
    marginHorizontal: formatSize(4)
  },
  labelText: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
