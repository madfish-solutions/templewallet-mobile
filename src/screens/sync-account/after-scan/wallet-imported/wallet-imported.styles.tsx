import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useWalletImportedStyles = createUseStyles(({ colors, typography }) => ({
  imageView: {
    marginTop: formatSize(72),
    alignItems: 'center'
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    textAlign: 'center'
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  alertDescription: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
