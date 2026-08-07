import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityFeedListStyles = createUseStyles(({ colors, typography }) => ({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16),
    backgroundColor: colors.pageBG
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4),
    paddingLeft: formatSize(16)
  },
  promotionItemWrapper: {
    margin: formatSize(16)
  },
  emptyListWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  additionalLoader: {
    height: formatSize(64),
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
