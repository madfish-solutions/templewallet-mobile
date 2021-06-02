import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useWhiteContainerDividerStyles = createUseStyles(({ colors }) => ({
  divider: {
    marginLeft: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  }
}));
