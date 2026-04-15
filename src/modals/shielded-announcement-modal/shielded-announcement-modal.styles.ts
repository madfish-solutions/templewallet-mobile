import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useShieldedAnnouncementStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  compositionImage: {
    marginTop: formatSize(-32),
    width: formatSize(375),
    height: formatSize(354)
  },
  title: {
    marginTop: formatSize(-32),
    ...typography.headline4Bold22,
    color: colors.black,
    textAlign: 'center',
    marginBottom: formatSize(16)
  },
  description: {
    ...typography.body15Regular,
    color: colors.gray1,
    textAlign: 'center',
    lineHeight: formatSize(20),
    marginBottom: formatSize(16)
  }
}));
