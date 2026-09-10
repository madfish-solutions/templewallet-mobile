import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePrivateTezosTokenHistoryStyles = createUseStyles(({ colors }) => ({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16),
    backgroundColor: colors.pageBG
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
