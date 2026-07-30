import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useDropdownItemContainerStyles = createUseStyles(({ colors }) => ({
  root: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12),
    backgroundColor: colors.cardBG,
    borderColor: colors.cardBG,
    borderWidth: formatSize(1),
    borderRadius: formatSize(8),
    boxShadow: iosCardShadow
  },
  rootMargin: {
    marginVertical: formatSize(4)
  },
  rootSelected: {
    borderColor: colors.orange,
    borderWidth: formatSize(1)
  }
}));
