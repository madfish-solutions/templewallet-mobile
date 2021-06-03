import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useWhiteContainerTextStyles = createUseStyles(({ colors, typography }) => ({
  text: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginLeft: formatSize(8)
  }
}));
