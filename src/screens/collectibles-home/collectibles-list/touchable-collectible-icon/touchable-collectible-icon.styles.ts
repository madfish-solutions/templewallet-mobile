import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTouchableCollectibleIconStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    width: formatSize(112),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(4)
  },
  description: {
    width: formatSize(112),
    paddingHorizontal: formatSize(4),
    paddingTop: formatSize(4),
    paddingBottom: formatSize(6)
  },
  name: {
    marginBottom: formatSize(2),
    ...typography.caption13Regular,
    color: colors.black
  },
  price: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));
