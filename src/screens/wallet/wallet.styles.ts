import { generateShadow } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useWalletStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: {
    padding: formatSize(16),
    backgroundColor: colors.navigation,
    ...generateShadow(colors.black10)
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  equityContainer: {
    marginVertical: formatSize(16)
  },
  equityHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  equityDateText: {
    ...typography.tagline11Tag,
    color: colors.gray3,
    marginLeft: formatSize(2)
  },
  equityXtzText: {
    ...typography.numbersMedium20,
    color: colors.black
  },
  equityUsdText: {
    ...typography.numbersRegular15,
    color: colors.gray1
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
}));
