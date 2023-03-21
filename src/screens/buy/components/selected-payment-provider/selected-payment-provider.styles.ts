import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useSelectedPaymentProviderStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(10),
    borderRadius: formatSize(10),
    backgroundColor: colors.white,
    ...generateShadow(1, black)
  },
  logoContainer: {
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    padding: formatSize(6),
    marginRight: formatSize(10)
  },
  name: {
    ...typography.numbersRegular15,
    letterSpacing: formatSize(-0.24),
    color: colors.black
  },
  limitRange: {
    ...typography.numbersRegular11,
    letterSpacing: formatSize(0.07),
    color: colors.gray1
  },
  infoPlaceholder: {
    ...typography.body15Regular,
    letterSpacing: formatSize(-0.24),
    color: colors.gray2
  },
  dropdownIcon: {
    position: 'absolute',
    top: formatSize(6),
    right: formatSize(8)
  }
}));
