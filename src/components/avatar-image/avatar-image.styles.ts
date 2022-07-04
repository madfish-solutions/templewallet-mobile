import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAvatarImageStyles = createUseStyles(({ colors }) => ({
  icon: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1)
  }
}));
