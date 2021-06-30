import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useDropdownItemContainerStyles = createUseStyles(({ colors }) => ({
  root: {
    padding: formatSize(8),
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: formatSize(2),
    borderRadius: formatSize(8),
    margin: formatSize(2),
    ...generateShadow(1, black)
  },
  rootMargin: {
    marginVertical: formatSize(4)
  },
  rootSelected: {
    borderColor: colors.orange
  }
}));
