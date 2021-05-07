import { lightDisabledColor, step, white } from '../../../config/styles';
import { ButtonStyleConfig } from '../button';

export const buttonLargeSharedStyleConfig: Omit<ButtonStyleConfig, 'activeColorConfig'> = {
  containerStyle: {
    height: 6.25 * step,
    borderRadius: 1.25 * step,
    borderWidth: 0.25 * step
  },
  titleStyle: {
    fontSize: 2.125 * step,
    fontWeight: '600'
  },
  iconStyle: {
    iconSize: 3 * step,
    iconMarginRight: step
  },
  disabledColorConfig: {
    titleColor: white,
    backgroundColor: lightDisabledColor
  }
};
