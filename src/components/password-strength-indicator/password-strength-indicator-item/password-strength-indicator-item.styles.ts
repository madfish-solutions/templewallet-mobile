import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { hexa } from 'src/utils/style.util';

export const usePasswordStrengthIndicatorItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    borderRadius: formatSize(4),
    borderWidth: DEFAULT_BORDER_WIDTH,
    paddingVertical: formatSize(4),
    paddingHorizontal: formatSize(10)
  },
  defaultRoot: {
    borderColor: colors.lines,
    backgroundColor: colors.gray4
  },
  errorRoot: {
    borderColor: colors.destructive,
    backgroundColor: hexa(colors.destructive, 0.15)
  },
  validRoot: {
    borderColor: colors.adding,
    backgroundColor: hexa(colors.adding, 0.15)
  },
  defaultText: {
    color: colors.gray1
  },
  errorText: {
    color: colors.destructive
  },
  validText: {
    color: colors.adding
  },
  text: {
    ...typography.caption11Regular
  }
}));
