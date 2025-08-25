import { DEFAULT_BORDER_WIDTH } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useModalButtonsContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.navigation,
    borderTopWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  }
}));
