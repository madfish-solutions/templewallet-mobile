import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useBlurStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: formatSize(4)
  },
  blurContainer: {
    position: 'absolute'
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marginBottom: {
    marginBottom: formatSize(12)
  },
  text: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
