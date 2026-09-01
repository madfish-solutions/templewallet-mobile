import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useContactsStyles = createUseStyles(({ colors }) => ({
  root: {
    flex: 1,
    backgroundColor: colors.pageBG
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingTop: formatSize(16),
    paddingBottom: formatSize(8)
  },
  emptyListContent: {
    flexGrow: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
