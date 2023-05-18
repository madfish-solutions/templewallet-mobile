import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useFarmItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.white,
    marginBottom: formatSize(8)
  },
  mainContent: {
    paddingHorizontal: formatSize(12),
    paddingBottom: formatSize(12)
  },
  bageContainer: {
    position: 'relative',
    flexDirection: 'row',
    marginBottom: formatSize(8)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  attributeTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  attributeValue: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  apyText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  tokensContainer: {
    paddingBottom: formatSize(8),
    borderBottomWidth: formatSize(1),
    marginBottom: formatSize(8),
    borderColor: colors.lines
  },
  bage: {
    position: 'relative',
    zIndex: 2,
    marginRight: formatSize(-8)
  },
  mb16: {
    marginBottom: formatSize(16)
  },
  earnSource: {
    flexDirection: 'row'
  }
}));
