import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

// test commit
export const useSignPayloadRequestConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  descriptionText: {
    ...typography.body15Semibold,
    color: colors.gray1
  },
  descriptionContainer: {
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  payloadText: {
    ...typography.numbersMedium13,
    color: colors.black
  }
}));
