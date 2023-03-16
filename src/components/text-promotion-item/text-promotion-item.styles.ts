import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useTextPromotionItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingHorizontal: formatSize(8),
    paddingVertical: formatSize(12),
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(10),
    flexDirection: 'row',
    position: 'relative',
    ...generateShadow(1, black)
  },
  image: {
    marginRight: formatSize(10),
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
    paddingVertical: formatSize(3),
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    flex: 0
  },
  adLabelText: {
    ...typography.tagline11Tag,
    color: colors.white
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
  },
  loaderContainer: {
    backgroundColor: colors.cardBG,
    width: formatSize(359),
    height: formatSize(80),
    borderRadius: formatSize(10),
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
