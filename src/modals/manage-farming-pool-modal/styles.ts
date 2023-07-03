import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageFarmingPoolModalStyles = createUseStylesMemoized(({ colors, typography }) => ({
  background: {
    backgroundColor: colors.pageBG,
    flex: 1,
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16)
  },
  depositPrompt: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  content: {
    flex: 1
  },
  notSupportedText: {
    color: colors.black
  },
  detailsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  restContainer: {
    flex: 1
  }
}));
