import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useInAppUpdateBannerStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    padding: formatSize(12),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    ...generateShadow(5, colors.grey)
  },
  title: {
    marginBottom: formatSize(2),
    ...typography.caption13Semibold,
    color: colors.black
  },
  description: {
    marginBottom: formatSize(16),
    ...typography.caption13Regular,
    color: colors.black
  },
  button: {
    height: formatSize(38)
  },
  buttonText: {
    ...typography.tagline13Tag
  }
}));
