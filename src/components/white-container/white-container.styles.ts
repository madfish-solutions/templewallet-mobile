import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useWhiteContainerStyles = createUseStyles(({ colors }) => ({
  container: {
    boxShadow: iosCardShadow,
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  }
}));
