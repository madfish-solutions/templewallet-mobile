import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBlurStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    overflow: 'hidden',
    borderRadius: formatSize(4),
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  content: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  text: {
    ...typography.body17Semibold,
    color: colors.black,
    marginTop: formatSize(12)
  }
}));
