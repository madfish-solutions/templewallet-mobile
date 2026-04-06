import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInfoTextStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingHorizontal: formatSize(16)
  }
}));
