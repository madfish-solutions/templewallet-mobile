import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenScreenStyles = createUseStyles(({ colors }) => ({
  sendAssetsListContainer: {
    padding: formatSize(8),
    backgroundColor: colors.pageBG,
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  }
}));
