import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useBannerStyles = createUseStyles(({ colors, typography }) => ({
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flex: 1
  },
  button: {
    height: formatSize(38)
  },
  buttonText: {
    ...typography.tagline13Tag
  }
}));
