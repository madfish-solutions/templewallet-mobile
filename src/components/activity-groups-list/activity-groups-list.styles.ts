import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityGroupsListStyles = createUseStyles(({ colors, typography }) => ({
  contentContainer: {
    flex: 1,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingLeft: formatSize(16)
  },
  adContainer: {
    paddingTop: formatSize(0),
    paddingBottom: formatSize(12),
    paddingHorizontal: formatSize(16)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4)
  },
  promotionItemWrapper: {
    paddingVertical: formatSize(12),
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  centeredItem: {
    alignSelf: 'center'
  },
  emptyListWrapper: {
    paddingTop: formatSize(96),
    alignItems: 'center'
  },
  additionalLoader: {
    paddingTop: formatSize(16)
  },
  promotionItem: {
    width: formatSize(343)
  }
}));
