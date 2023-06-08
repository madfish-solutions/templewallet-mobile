import { red, transparent } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useErrorMessageStyles = createUseStylesMemoized(({ typography }) => ({
  root: {
    ...typography.caption11Regular,
    color: transparent,
    lineHeight: formatSize(13),
    marginVertical: formatSize(6),
    marginLeft: formatSize(6),
    alignSelf: 'flex-start'
  },
  rootVisible: {
    color: red
  }
}));
