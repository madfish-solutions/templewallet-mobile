import { step } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';

export const useSliderStyles = createUseStyles(({ colors }) => ({
  slider: {
    height: step * 5
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContainerText: {
    color: colors.black
  }
}));
