import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const CARD_BORDER_RADIUS = formatSize(8);
export const CARD_HEIGHT = formatSize(96);
export const CARD_MARGIN_HORIZONTAL = formatSize(24);

export const useKoloCryptoCardPreviewStyles = createUseStylesMemoized(({ typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: formatSize(8),
    height: formatSize(96),
    marginHorizontal: formatSize(8),
    marginBottom: formatSize(-48),
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12)
  },
  title: {
    ...typography.body15Semibold,
    color: 'white',
    textAlign: 'left'
  },
  svgStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CARD_BORDER_RADIUS
  }
}));
