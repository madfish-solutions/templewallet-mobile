import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDAppsStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingLeft: formatSize(20),
    paddingRight: formatSize(36),
    paddingBottom: formatSize(16),
    paddingTop: formatSize(8)
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
