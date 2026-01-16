import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useHeaderCardStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    paddingTop: formatSize(4),
    padding: formatSize(16),
    backgroundColor: colors.navigation,
    marginBottom: formatSize(1)
  }
}));
