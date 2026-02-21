import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useModalButtonsFloatingContainerStyles = createUseStylesMemoized(({ colors }) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: formatSize(16)
  },
  bordered: {
    backgroundColor: colors.white
  },
  minimal: {
    borderTopWidth: 0
  },
  flex: {
    flex: 1
  }
}));
