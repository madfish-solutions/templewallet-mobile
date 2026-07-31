import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

const BADGE_SIZE = formatSize(16);

export const useTokenIconWithNetworkStyles = createUseStyles(({ colors }) => ({
  container: {
    position: 'relative',
    margin: formatSize(2)
  },
  networkBadge: {
    position: 'absolute',
    right: formatSize(2),
    bottom: formatSize(2),
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BADGE_SIZE / 2,
    borderWidth: formatSize(0.8),
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  }
}));
