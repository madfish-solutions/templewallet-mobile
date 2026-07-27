import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSendModalStyles = createUseStyles(({ colors, typography }) => ({
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  recipientInput: {
    height: formatSize(80),
    minHeight: formatSize(80)
  },
  assetAmountInput: {
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: formatSize(28)
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(4)
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: formatSize(36),
    paddingLeft: formatSize(8),
    paddingRight: formatSize(12),
    paddingVertical: formatSize(8),
    marginRight: formatSize(8),
    borderWidth: 0,
    borderRadius: formatSize(18),
    backgroundColor: colors.input
  },
  filterChipSelected: {
    backgroundColor: colors.blue10
  },
  filterIconContainer: {
    width: formatSize(20),
    height: formatSize(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: formatSize(10),
    backgroundColor: colors.white,
    borderColor: colors.gray4,
    borderWidth: formatSize(1)
  },
  filterChipText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  filterChipTextSelected: {
    color: colors.blue
  }
}));
