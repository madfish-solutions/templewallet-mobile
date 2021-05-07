import { borderColor, grey4, orange, orange01, step } from '../../../config/styles';
import { ButtonStyleConfig } from '../button-style.config';

export const buttonMediumStyleConfig: ButtonStyleConfig = {
  containerStyle: {
    height: 5 * step,
    borderRadius: step
  },
  titleStyle: {
    fontSize: 1.625 * step,
    fontWeight: '600'
  },
  iconStyle: {
    iconSize: 2 * step,
    iconMarginRight: 0.25 * step
  },
  activeColorConfig: {
    titleColor: orange,
    backgroundColor: orange01
  },
  disabledColorConfig: {
    titleColor: borderColor,
    backgroundColor: grey4
  }
};
