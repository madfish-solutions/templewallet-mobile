import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useExolixStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    padding: formatSize(16),
    backgroundColor: colors.pageBG
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
