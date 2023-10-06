import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHeaderTitleStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body17Semibold,
    color: colors.black,
    marginHorizontal: formatSize(16)
  },
  whiteColor: {
    color: colors.white
  }
}));
