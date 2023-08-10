import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(({ colors, typography }) => ({
  searchInput: {
    marginTop: formatSize(12),
    marginBottom: formatSize(4)
  },
  wrapper: {
    marginTop: formatSize(20),
    paddingHorizontal: formatSize(16)
  },
  text: {
    marginBottom: formatSize(12),
    color: colors.black,
    ...typography.body15Semibold
  },
  dappIcon: {
    marginLeft: formatSize(24)
  },
  textWrapper: {
    marginLeft: formatSize(16)
  },
  headingText: {
    ...typography.body15Semibold,
    color: colors.white
  },
  descriptionText: {
    ...typography.caption11Regular,
    color: colors.white
  },
  flatList: {
    marginTop: formatSize(12)
  },
  flatListContentContainer: {
    paddingHorizontal: formatSize(16),
    paddingBottom: formatSize(16)
  },
  flatListColumnWrapper: {
    justifyContent: 'space-between'
  },
  marginRight: {
    marginRight: formatSize(16)
  }
}));
