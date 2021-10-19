import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginHorizontal: formatSize(16)
  },
  marginLeft: {
    marginLeft: formatSize(16)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    marginLeft: formatSize(6)
  },
  list: {
    height: formatSize(350)
  }
}));
