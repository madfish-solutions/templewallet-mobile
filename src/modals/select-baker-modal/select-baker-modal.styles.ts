import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSelectBakerModalStyles = createUseStyles(({ colors, typography }) => ({
  background: {
    backgroundColor: colors.navigation
  },
  upperContainer: {
    paddingHorizontal: formatSize(16)
  },
  searchContainer: {
    paddingHorizontal: formatSize(8)
  },
  infoText: {
    ...typography.caption11Regular,
    color: colors.black,
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(4)
  },
  flatList: {
    backgroundColor: colors.navigation,
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
