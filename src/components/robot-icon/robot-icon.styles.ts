import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRobotIconStyles = createUseStyles(({ colors }) => ({
  root: {
    borderWidth: formatSize(1),
    padding: formatSize(1),
    overflow: 'hidden'
  },
  blue: {
    borderColor: colors.blue
  },
  gray: {
    borderColor: colors.lines
  },
  orange: {
    borderColor: colors.orange
  },
  none: {
    borderWidth: 0,
    padding: 0
  }
}));
