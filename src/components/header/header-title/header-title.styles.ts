import { formatSize } from 'src/styles/format-size';

import { createUseStyles } from '../../../styles/create-use-styles';

export const useHeaderTitleStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body17Semibold,
    color: colors.black,
    maxWidth: formatSize(230)
  },
  whiteColor: {
    color: colors.white
  }
}));
