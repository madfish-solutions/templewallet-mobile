import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useSignPayloadRequestConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  descriptionText: {
    ...typography.body15Semibold,
    color: colors.gray1
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: formatSize(12),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  payloadText: {
    ...typography.numbersMedium13,
    color: colors.black
  }
}));
