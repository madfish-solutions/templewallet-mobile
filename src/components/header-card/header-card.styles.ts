import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

export const useHeaderCardStyles = createUseStyles(({ colors }) => ({
  container: {
    zIndex: 1,
    paddingTop: formatSize(4),
    paddingLeft: formatSize(16),
    paddingRight: formatSize(16),
    paddingBottom: 0,
    backgroundColor: colors.navigation,
    marginBottom: formatSize(1)
  },
  containerWithShadow: {
    boxShadow: iosCardShadow
  }
}));
