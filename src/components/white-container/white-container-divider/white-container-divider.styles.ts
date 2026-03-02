import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWhiteContainerDividerStyles = createUseStyles(({ colors }) => ({
  divider: {
    marginLeft: formatSize(16),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  }
}));
