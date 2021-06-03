import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

const size = formatSize(40);

export const useSocialButtonStyles = createUseStyles(({ colors }) => ({
  container: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: formatSize(6),
    borderRadius: formatSize(8),
    backgroundColor: colors.orange10
  }
}));
