import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePromotionCarouselStyles = createUseStyles(({ colors, typography }) => ({
  paginationContainer: {
    paddingVertical: formatSize(2)
  },
  paginationDot: {
    width: formatSize(8),
    height: formatSize(8),
    borderRadius: formatSize(4),
    backgroundColor: colors.peach
  },
  paginationInactiveDot: {
    backgroundColor: colors.lines
  },
  footer: {
    position: 'relative'
  },
  walletNavigationButton: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletNavigationButtonText: {
    ...typography.numbersStatus8,
    color: colors.peach,
    textTransform: 'uppercase'
  }
}));
