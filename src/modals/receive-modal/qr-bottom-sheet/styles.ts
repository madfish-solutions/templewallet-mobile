import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useQrBottomSheetStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    height: '100%',
    marginBottom: formatSize(32),
    marginHorizontal: formatSize(8),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(12),
    overflow: 'hidden'
  },
  text: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  contentContainer: {
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(24),
    gap: formatSize(8),
    alignItems: 'center'
  },
  qrCodeRow: {
    marginBottom: formatSize(8),
    flexDirection: 'row',
    justifyContent: 'center'
  },
  qrCodeContainer: {
    ...generateShadow(1, black),
    backgroundColor: colors.white,
    borderRadius: formatSize(8),
    padding: formatSize(16)
  }
}));
