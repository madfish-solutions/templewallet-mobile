import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSyncAccountStyles = createUseStyles(({ colors, typography }) => ({
  titleContainer: {
    marginVertical: formatSize(28)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    marginVertical: formatSize(12)
  },
  text: {
    ...typography.body15Semibold,
    color: colors.gray1,
    marginBottom: formatSize(24)
  }
}));
