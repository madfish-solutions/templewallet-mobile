import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAvatarImageStyles = createUseStyles(({ colors }) => ({
  icon: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    resizeMode: 'cover',
    minWidth: formatSize(16),
    minHeight: formatSize(16),
    maxWidth: formatSize(16),
    maxHeight: formatSize(16),
    borderWidth: formatSize(1)
  }
}));
