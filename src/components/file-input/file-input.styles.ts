import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFileInputStyles = createUseStyles(({ typography, colors }) => ({
  filledInput: {
    height: formatSize(48),
    borderRadius: formatSize(4),
    borderWidth: formatSize(2),
    borderStyle: 'dashed',
    borderColor: colors.orange,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: formatSize(20)
  },
  fileName: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
