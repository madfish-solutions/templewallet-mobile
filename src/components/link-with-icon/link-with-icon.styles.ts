import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLinkWithIconStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row'
  },
  container: {
    marginRight: formatSize(2),
    paddingVertical: formatSize(2),
    paddingHorizontal: formatSize(4),
    borderRadius: formatSize(4),
    backgroundColor: colors.blue10,
    overflow: 'hidden'
  },
  text: {
    maxWidth: formatSize(104),
    ...typography.body15Regular,
    color: colors.blue
  }
}));
