import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEvmTransactionFeeDetailsStyles = createUseStyles(({ typography }) => ({
  feeInfoItem: {
    width: '100%'
  },
  attentionMessageText: {
    ...typography.caption13Regular,
    lineHeight: formatSize(18)
  }
}));
