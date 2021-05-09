import { step } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';

export const useScreenContainerStyles = createUseStyles(({ colors }) => ({
  scrollViewContentContainer: {
    margin: step,
    backgroundColor: colors.pageBG
  }
}));
