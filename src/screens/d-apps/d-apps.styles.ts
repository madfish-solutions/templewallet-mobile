import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(({ colors, typography }) => ({
  contentContainer: {
    paddingHorizontal: formatSize(20),
    paddingBottom: formatSize(16)
  },
  text: {
    ...typography.body15Semibold,
    color: colors.black,
    paddingHorizontal: formatSize(16)
  },
  dappBlockWrapper: {
    paddingHorizontal: formatSize(20)
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
