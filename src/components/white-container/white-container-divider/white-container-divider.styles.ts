import { DEFAULT_BORDER_WIDTH } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useWhiteContainerDividerStyles = createUseStyles(({ colors }) => ({
  divider: {
    marginLeft: formatSize(16),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  }
}));
