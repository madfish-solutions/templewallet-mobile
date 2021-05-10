import { createUseStyles } from '../../../styles/create-use-styles';

export const useBottomSheetBackdropStyles = createUseStyles(({colors}) => ({
  container: {
    backgroundColor: colors.black
  },
  touchable: {
    flex: 1
  }
}));
