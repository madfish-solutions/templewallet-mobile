import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRobotIconStyles = createUseStyles(({ colors }) => ({
  root: {
    borderColor: colors.lines,
    borderRadius: formatSize(4),
    borderWidth: formatSize(1),
    overflow: 'hidden'
  }
}));
