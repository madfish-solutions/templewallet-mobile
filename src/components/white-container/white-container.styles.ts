import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useWhiteContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, colors.black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  }
}));
