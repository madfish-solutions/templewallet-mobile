import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { hexa } from '../../utils/style.util';

export const useSearchInputStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    position: 'relative'
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: formatSize(10),
    justifyContent: 'center'
  },
  input: {
    ...typography.body17Regular,
    color: colors.black,
    padding: formatSize(8),
    paddingLeft: formatSize(32),
    borderRadius: formatSize(10),
    backgroundColor: hexa('#8E8E93', 0.12)
  }
}));
