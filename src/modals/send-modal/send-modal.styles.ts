import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSendModalStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  }
}));
