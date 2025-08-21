import { DEFAULT_BORDER_WIDTH, white } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePaymentProviderStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    position: 'relative'
  },
  tagsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: formatSize(-10),
    left: formatSize(-10)
  },
  tag: {
    paddingHorizontal: formatSize(12),
    borderTopLeftRadius: formatSize(10),
    borderBottomRightRadius: formatSize(10),
    height: formatSize(21),
    justifyContent: 'center'
  },
  overlapped: {
    marginLeft: formatSize(-6)
  },
  tagLabel: {
    ...typography.caption11Semibold,
    color: white,
    letterSpacing: formatSize(0.07)
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoContainer: {
    borderWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    padding: formatSize(6),
    marginRight: formatSize(10)
  },
  providerInfoContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  outputInfoContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: formatSize(8)
  },
  infoTitle: {
    ...typography.numbersRegular15,
    letterSpacing: formatSize(-0.24),
    color: colors.black
  },
  infoSubtitle: {
    ...typography.numbersRegular11,
    letterSpacing: formatSize(0.07),
    color: colors.gray1
  },
  checkmark: {
    position: 'absolute',
    top: formatSize(-4.5),
    right: formatSize(-2.5)
  },
  noTagsCheckmark: {
    top: formatSize(-2),
    right: 0
  }
}));
