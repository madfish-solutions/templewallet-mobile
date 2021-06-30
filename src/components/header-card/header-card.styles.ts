import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useHeaderCardStyles = createUseStyles(({ colors }) => ({
  container: {
    padding: formatSize(16),
    backgroundColor: colors.navigation,
    ...generateShadow(2, black),
    marginBottom: formatSize(4)
  }
}));
