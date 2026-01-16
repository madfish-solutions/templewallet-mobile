import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRobotIconStyles = createUseStyles(({ colors }) => ({
  root: {
    borderColor: colors.lines,
    padding: formatSize(4),
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    overflow: 'hidden'
  }
}));
