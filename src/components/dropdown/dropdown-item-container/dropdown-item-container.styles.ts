import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useDropdownItemContainerStyles = createUseStyles(({ colors }) => ({
  root: {
    padding: formatSize(12),
    backgroundColor: colors.cardBG,
    borderColor: colors.cardBG,
    borderWidth: formatSize(1),
    borderRadius: formatSize(8),
    ...generateShadow(1, black)
  },
  rootMargin: {
    marginVertical: formatSize(4)
  },
  rootSelected: {
    borderColor: colors.orange,
    borderWidth: formatSize(1)
  }
}));
