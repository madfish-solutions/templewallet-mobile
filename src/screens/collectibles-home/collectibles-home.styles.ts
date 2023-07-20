import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCollectiblesHomeStyles = createUseStyles(({ colors, typography }) => ({
  headerCard: {
    paddingHorizontal: 0
  },
  widthPaddingHorizontal: {
    paddingHorizontal: formatSize(16)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  walletNavigationButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletNavigationButtonText: {
    ...typography.tagline13Tag,
    color: colors.peach,
    textTransform: 'uppercase'
  },
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingVertical: formatSize(8)
  }
}));
