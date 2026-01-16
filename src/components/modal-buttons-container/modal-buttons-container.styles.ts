import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useModalButtonsContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.navigation,
    borderTopWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  }
}));
