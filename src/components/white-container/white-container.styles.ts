import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useWhiteContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  }
}));
