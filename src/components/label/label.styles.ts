import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLabelStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginBottom: formatSize(4),
    marginHorizontal: formatSize(4)
  },
  label: {
    ...typography.body15Semibold,
    color: colors.black,
    marginBottom: formatSize(4)
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    marginBottom: formatSize(4)
  }
}));
