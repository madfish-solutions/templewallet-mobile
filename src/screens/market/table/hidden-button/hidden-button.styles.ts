import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useHiddenButtonStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: formatSize(10),
    paddingVertical: formatSize(12),
    alignItems: 'center',
    backgroundColor: colors.peach10
  },
  icon: {
    marginBottom: formatSize(4)
  },
  text: {
    ...typography.caption11Regular,
    textAlign: 'center',
    color: colors.peach
  }
}));
