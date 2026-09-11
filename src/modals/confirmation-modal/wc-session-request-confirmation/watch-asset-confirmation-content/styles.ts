import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWatchAssetConfirmationContentStyles = createUseStyles(({ colors, typography }) => ({
  preview: {
    gap: formatSize(8)
  },
  previewTitle: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  tokenMetadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  tokenMetadataLeftPart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8),
    flex: 1
  },
  tokenMetadataTexts: {
    gap: formatSize(4)
  },
  tokenMetadataSymbol: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  tokenMetadataDecimals: {
    ...typography.caption10Regular,
    color: colors.black
  }
}));
