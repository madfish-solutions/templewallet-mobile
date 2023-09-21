import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useHistoryStyles = createUseStyles(({ colors }) => ({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: formatSize(16),
    paddingHorizontal: formatSize(16)
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
  collectible: {
    marginBottom: formatSize(4)
  }
}));
