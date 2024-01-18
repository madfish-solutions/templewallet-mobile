import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useChooseWalletImportTypeStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.pageBG,
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(16)
  },
  textContainer: {
    paddingHorizontal: formatSize(4)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    lineHeight: formatTextSize(20)
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    lineHeight: formatTextSize(18)
  },
  button: {
    paddingHorizontal: formatSize(8)
  }
}));
