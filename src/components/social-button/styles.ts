import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

const size = formatSize(40);

export const useSocialButtonStyles = createUseStyles(({ colors }) => ({
  container: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: formatSize(8),
    backgroundColor: colors.orange10
  },
  enabledColor: {
    color: colors.orange
  },
  disabledColor: {
    color: colors.disabled
  }
}));
