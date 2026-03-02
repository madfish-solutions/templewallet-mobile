import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAvatarImageStyles = createUseStyles(({ colors }) => ({
  icon: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1)
  }
}));
