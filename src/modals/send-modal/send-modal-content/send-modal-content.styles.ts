import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useSendModalContentStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  amountInputHeading: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  switcherOptionText: {
    ...typography.caption13Semibold
  },
  measurementTextsContainer: {
    flexDirection: 'row',
    height: 0
  },
  amountDescriptionText: {
    ...typography.caption13Regular
  },
  subtitle: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    flexShrink: 1
  }
}));
