import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useInfoTextStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingHorizontal: formatSize(16)
  }
}));
