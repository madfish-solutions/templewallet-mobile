import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useOperationsPreviewItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black,
    flexShrink: 1
  },
  hashContainer: {
    flexShrink: 0
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amountToken: {
    ...typography.numbersRegular17,
    color: colors.destructive,
    textAlign: 'right'
  },
  amountDollar: {
    ...typography.numbersRegular11,
    color: colors.destructive,
    textAlign: 'right'
  }
}));
