import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityGroupsListStyles = createUseStyles(({ colors, typography }) => ({
  contentContainer: {
    flex: 1,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16)
  },
  adContainer: {
    paddingBottom: formatSize(12),
    paddingRight: formatSize(16)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4),
    marginLeft: formatSize(16)
  },
  promotionItemWrapper: {
    paddingVertical: formatSize(12),
    marginLeft: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  centeredItem: {
    alignSelf: 'center'
  },
  emptyListWrapper: {
    alignItems: 'center'
  },
  loaderWrapper: {
    paddingTop: formatSize(56)
  },
  additionalLoader: {
    paddingTop: formatSize(16)
  },
  promotionItem: {
    width: formatSize(343)
  }
}));
