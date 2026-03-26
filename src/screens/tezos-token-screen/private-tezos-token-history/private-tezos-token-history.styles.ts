import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePrivateTezosTokenHistoryStyles = createUseStyles(() => ({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16)
  },
  emptyListWrapper: {
    alignItems: 'center'
  },
  loaderWrapper: {
    paddingTop: formatSize(56)
  },
  promotionItemWrapper: {
    margin: formatSize(16)
  }
}));
