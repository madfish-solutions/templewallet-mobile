import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEvmSwapPreviewStyles = createUseStyles(({ colors }) => ({
  card: {
    paddingRight: formatSize(12),
    paddingBottom: formatSize(18)
  },
  approvalAmount: {
    color: colors.black
  }
}));
