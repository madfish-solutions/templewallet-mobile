import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSendModalStyles = createUseStyles(({ colors, typography }) => ({
  hidden: {
    display: 'none'
  },
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  }
}));
