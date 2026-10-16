import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenEquityValueStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    marginTop: formatSize(24)
  },
  equityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateText: {
    ...typography.tagline11Tag,
    color: colors.gray3,
    marginLeft: formatSize(2),
    textTransform: 'uppercase'
  },
  mainValueText: {
    ...typography.numbersMedium28,
    color: colors.black
  },
  additionalValueText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  },
  totalEquityText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    marginBottom: formatSize(2)
  }
}));
