import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useBannerStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    width: '100%',
    padding: formatSize(16),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  description: {
    marginTop: formatSize(4),
    ...typography.caption13Regular,
    color: colors.black
  }
}));
