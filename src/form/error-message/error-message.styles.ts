import { transparent } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useErrorMessageStyles = createUseStylesMemoized(({ typography, colors }) => ({
  root: {
    ...typography.caption11Regular,
    color: transparent,
    lineHeight: formatTextSize(13),
    marginVertical: formatSize(6),
    marginLeft: formatSize(6),
    alignSelf: 'flex-start'
  },
  rootVisible: {
    color: colors.destructive
  }
}));
