import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSelectBakerModalStyles = createUseStyles(({ colors, typography }) => ({
  upperContainer: {
    paddingTop: formatSize(16),
    paddingHorizontal: formatSize(16)
  },
  infoText: {
    ...typography.caption11Regular,
    color: colors.black,
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(4)
  },
  flatList: {
    paddingHorizontal: formatSize(16)
  },
  buttonsContainer: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.navigation,
    borderTopWidth: formatSize(0.5),
    borderColor: colors.lines
  }
}));
