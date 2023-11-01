import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenEquityValueStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    marginVertical: formatSize(16)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
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
    ...typography.numbersMedium20,
    color: colors.black
  },
  additionalValueText: {
    ...typography.numbersRegular15,
    color: colors.gray1
  }
}));

export const useAssetEquityTextStyles = createUseStylesMemoized(({ colors }) => ({
  numberText: {
    color: colors.gray1
  }
}));
