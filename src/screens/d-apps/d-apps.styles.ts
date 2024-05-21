import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDAppsStyles = createUseStylesMemoized(({ colors, typography }) => ({
  rowContainer: {
    flexDirection: 'row'
  },
  contentContainer: {
    paddingHorizontal: formatSize(8),
    paddingBottom: formatSize(16)
  },
  text: {
    ...typography.body15Semibold,
    color: colors.black,
    paddingHorizontal: formatSize(16),
    marginVertical: formatSize(12)
  },
  dappBlockWrapper: {
    paddingHorizontal: formatSize(16),
    marginBottom: formatSize(12)
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
  }
}));
