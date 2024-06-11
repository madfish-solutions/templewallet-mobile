import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useCheckboxGroupStyles = createUseStylesMemoized(({ colors }) => ({
  root: {
    backgroundColor: colors.cardBG,
    ...generateShadow(1, black),
    paddingLeft: formatSize(12),
    borderRadius: formatSize(10)
  },
  error: {
    borderWidth: formatSize(1),
    borderColor: colors.destructive
  },
  separator: {
    width: 'auto',
    marginLeft: formatSize(4)
  }
}));
