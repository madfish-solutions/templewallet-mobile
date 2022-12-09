import { formatSize } from '../../../styles/format-size';
import { createUseStyles } from './../../../styles/create-use-styles';

export const useHiddenButtonStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: formatSize(20),
    paddingVertical: formatSize(12),
    alignItems: 'center',
    backgroundColor: colors.peach10
  },
  text: {
    ...typography.caption11Regular,
    textAlign: 'center',
    color: colors.peach
  }
}));
