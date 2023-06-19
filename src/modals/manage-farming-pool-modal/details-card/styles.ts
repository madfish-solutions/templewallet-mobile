import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDetailsCardStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    backgroundColor: colors.cardBG,
    padding: formatSize(12),
    borderRadius: formatSize(10)
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: formatSize(8)
  },
  titleBorder: {
    marginBottom: formatSize(8)
  },
  statsRow: {
    flexDirection: 'row'
  },
  statsValue: {
    ...typography.numbersRegular17,
    letterSpacing: formatSize(-0.41),
    color: colors.black
  },
  timespanUnit: {
    ...typography.numbersRegular13,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  },
  apyLabel: {
    ...typography.caption13Semibold,
    letterSpacing: formatSize(-0.08),
    color: colors.black
  }
}));
