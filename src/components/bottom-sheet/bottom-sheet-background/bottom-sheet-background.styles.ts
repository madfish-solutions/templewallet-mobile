import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useBottomSheetBackgroundStyles = createUseStyles(({ colors }) => ({
  root: {
    backgroundColor: colors.pageBG,
    marginTop: formatSize(16)
  }
}));
