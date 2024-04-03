import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityGroupsListStyles = createUseStyles(({ colors, typography }) => ({
  contentContainer: {
    flex: 1,
    paddingBottom: formatSize(16)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4),
    marginLeft: formatSize(16)
  },
  promotionItemWrapper: {
    margin: formatSize(16)
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
  }
}));
