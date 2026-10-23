import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

const ETHERLINK_LOGO_BACKGROUND = '#151515';

export const useBridgeBannerStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: formatSize(16),
    padding: formatSize(12),
    borderRadius: formatSize(10),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    backgroundColor: colors.cardBG
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: formatSize(10)
  },
  logoContainer: {
    width: formatSize(32),
    height: formatSize(32),
    borderRadius: formatSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ETHERLINK_LOGO_BACKGROUND
  },
  texts: {
    flexShrink: 1,
    gap: formatSize(2)
  },
  title: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
