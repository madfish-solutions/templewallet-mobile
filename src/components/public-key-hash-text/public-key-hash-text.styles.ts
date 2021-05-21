import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const usePublicKeyHashTextStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    width: formatSize(100),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  publicKeyHashText: {
    ...typography.numbersRegular15,
    color: colors.blue
  }
}));
