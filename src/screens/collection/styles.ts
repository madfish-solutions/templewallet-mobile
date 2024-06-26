import { LIMIT_NFT_FEATURES } from 'src/config/system';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { ITEM_WIDTH, GAP_SIZE, BORDER_RADIUS } from './utils';

export const useCollectionStyles = createUseStylesMemoized(() => ({
  root: {
    flex: 1
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  contentContainerStyle: {
    paddingVertical: formatSize(LIMIT_NFT_FEATURES ? 30 : 12),
    paddingLeft: formatSize(24) - formatSize(GAP_SIZE),
    paddingRight: formatSize(24)
  }
}));

export const useCollectionClosingComponentStyles = createUseStylesMemoized(({ colors }) => ({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: formatSize(ITEM_WIDTH),
    marginLeft: formatSize(GAP_SIZE)
  },
  loader: {
    flex: 1,
    borderWidth: formatSize(1),
    borderRadius: formatSize(BORDER_RADIUS),
    borderColor: colors.lines,
    backgroundColor: colors.navigation,
    width: formatSize(ITEM_WIDTH),
    marginLeft: formatSize(GAP_SIZE),
    position: 'relative',
    justifyContent: 'center'
  }
}));
