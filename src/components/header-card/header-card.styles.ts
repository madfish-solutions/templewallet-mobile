import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useHeaderCardStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    paddingTop: formatSize(4),
    padding: formatSize(16),
    backgroundColor: colors.navigation,
    marginBottom: formatSize(1)
  }
}));
