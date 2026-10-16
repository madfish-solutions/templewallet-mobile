import { white } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

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
    boxShadow: iosCardShadow,
    backgroundColor: white,
    borderRadius: formatSize(8),
    padding: formatSize(20)
  }
}));
