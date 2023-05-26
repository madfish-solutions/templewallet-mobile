import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useBlurStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: formatSize(4)
  },
  blurContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  blurLayout: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  marginBottom: {
    marginBottom: formatSize(12)
  },
  text: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
