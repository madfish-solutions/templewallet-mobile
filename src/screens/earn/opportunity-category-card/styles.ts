import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useOpportunityCategoryCardStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    marginVertical: formatSize(8),
    marginHorizontal: formatSize(16),
    padding: formatSize(16)
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    ...typography.body15Semibold,
    letterSpacing: formatSize(-0.24),
    color: colors.black,
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  description: {
    ...typography.caption13Regular,
    width: formatSize(210),
    letterSpacing: formatSize(-0.08),
    color: colors.black
  },
  leftStatsItem: {
    alignItems: 'flex-start'
  },
  rightStatsItem: {
    alignItems: 'flex-end'
  },
  statsItemLabel: {
    ...typography.caption11Regular,
    letterSpacing: formatSize(0.07),
    color: colors.gray1
  },
  statsItemValue: {
    ...typography.numbersRegular17,
    letterSpacing: formatSize(-0.41),
    color: colors.black
  }
}));
