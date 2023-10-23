import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHistoryStyles = createUseStyles(({ colors }) => ({
  root: {
    flex: 1
  },
  row: {
    flexDirection: 'row'
  },
  marginRight: {
    marginRight: formatSize(4)
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.pageBG
  },
  contentContainer: {
    paddingHorizontal: formatSize(16),
    paddingBottom: formatSize(16)
  },
  collectible: {
    marginBottom: formatSize(4)
  }
}));
