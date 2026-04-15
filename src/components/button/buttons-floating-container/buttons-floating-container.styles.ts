import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useButtonsFloatingContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    borderTopWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(8),
    backgroundColor: colors.pageBG
  }
}));
