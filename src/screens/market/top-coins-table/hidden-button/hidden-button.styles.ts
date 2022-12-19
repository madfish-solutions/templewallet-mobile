import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useHiddenButtonStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: formatSize(10),
    paddingVertical: formatSize(12),
    alignItems: 'center'
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
  iconColorized: {
    color: colors.peach
  },
  iconUncolorized: {
    color: colors.peach10
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
