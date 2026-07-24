import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenListStyles = createUseStylesMemoized(({ colors }) => ({
  listContainer: {
    flexGrow: 1,
    backgroundColor: colors.pageBG
  },
  listContainerWithAd: {
    height: formatSize(100),
    backgroundColor: colors.pageBG
  },
  headerContainer: {
    height: formatSize(64),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    backgroundColor: colors.pageBG,
    zIndex: 1
  },
  promotionItemWrapper: {
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(8)
  },
  promotionItemBorder: {
    marginLeft: formatSize(16)
  },
  promotionItem: {
    width: '100%'
  },
  banner: {
    marginVertical: formatSize(12),
    marginHorizontal: formatSize(16)
  },
  searchInputContainer: {
    flex: 1,
    marginRight: formatSize(16)
  }
}));
