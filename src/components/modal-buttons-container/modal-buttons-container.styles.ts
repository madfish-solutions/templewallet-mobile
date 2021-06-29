import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useModalButtonsContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.navigation,
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines
  }
}));
