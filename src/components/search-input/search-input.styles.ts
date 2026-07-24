import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSearchInputStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    position: 'relative'
  },
  searchIconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: formatSize(12),
    justifyContent: 'center'
  },
  input: {
    ...typography.caption13Regular,
    color: colors.black,
    paddingVertical: formatSize(8),
    paddingLeft: formatSize(32),
    paddingRight: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.input
  },
  clearableInput: {
    paddingRight: formatSize(32)
  },
  clearIconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: formatSize(12),
    justifyContent: 'center'
  }
}));
