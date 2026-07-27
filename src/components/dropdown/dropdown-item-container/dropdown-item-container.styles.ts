import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useDropdownItemContainerStyles = createUseStyles(({ colors }) => ({
  root: {
    padding: formatSize(12),
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: formatSize(1),
    borderRadius: formatSize(8),
    marginVertical: formatSize(2),
    ...generateShadow(1, black)
  },
  rootMargin: {
    marginVertical: formatSize(4)
  },
  rootSelected: {
    borderColor: colors.orange,
    borderWidth: formatSize(1),
    borderRadius: formatSize(10),
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12)
  },
  compactRoot: {
    paddingVertical: formatSize(6),
    paddingHorizontal: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    shadowOpacity: 0,
    elevation: 0
  }
}));
