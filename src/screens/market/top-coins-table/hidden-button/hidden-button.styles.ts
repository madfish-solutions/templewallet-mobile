import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHiddenButtonStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: formatSize(10),
    paddingVertical: formatSize(12),
    alignItems: 'center',
    minWidth: formatSize(74),
    flexBasis: formatSize(74),
    flexGrow: 1
  },
  rootContainerActive: {
    backgroundColor: colors.peach10
  },
  rootContainerDisabled: {
    backgroundColor: colors.gray4
  },
  icon: {
    marginBottom: formatSize(4)
  },
  iconActive: {
    color: colors.peach
  },
  iconDisabled: {
    color: colors.gray2
  },
  text: {
    ...typography.caption11Regular,
    textAlign: 'center'
  },
  textActive: {
    color: colors.peach
  },
  textDisabled: {
    color: colors.gray2
  }
}));
