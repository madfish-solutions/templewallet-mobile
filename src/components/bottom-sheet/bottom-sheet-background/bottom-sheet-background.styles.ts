import { step } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';

export const useBottomSheetBackgroundStyles = createUseStyles(({ colors }) => ({
  root: {
    backgroundColor: colors.pageBG,
    marginTop: 2 * step
  }
}));
