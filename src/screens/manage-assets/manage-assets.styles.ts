import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useManageAssetsStyles = createUseStyles(({ colors, typography }) => ({
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(4)
  },
  contentContainerStyle: {
    paddingRight: 0,
    paddingLeft: formatSize(16)
  },
  inputContainer: {
    marginVertical: formatSize(8),
    marginHorizontal: formatSize(16)
  }
}));
