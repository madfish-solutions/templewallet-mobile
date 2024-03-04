import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useTextPromotionViewStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    paddingHorizontal: formatSize(7.5),
    paddingVertical: formatSize(12),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(10),
    flexDirection: 'row',
    position: 'relative',
    ...generateShadow(1, black)
  },
  invisible: {
    opacity: 0
  },
  imageContainer: {
    marginRight: formatSize(9.5),
    borderRadius: formatSize(16.5),
    borderColor: colors.cardBG,
    borderWidth: formatSize(0.5)
  },
  image: {
    borderRadius: formatSize(16),
    width: formatSize(32),
    height: formatSize(32)
  },
  textsContainer: {
    flex: 1
  },
  headline: {
    marginBottom: formatSize(2),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headlineText: {
    ...typography.caption13Semibold,
    color: colors.black,
    letterSpacing: formatSize(-0.08)
  },
  adLabel: {
    marginLeft: formatSize(4),
    paddingHorizontal: formatSize(6),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    flex: 0
  },
  adLabelText: {
    ...typography.tagline11Tag,
    color: 'white'
  },
  content: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  },
  closeButton: {
    position: 'absolute',
    top: formatSize(6),
    right: formatSize(6),
    padding: formatSize(6)
  }
}));
