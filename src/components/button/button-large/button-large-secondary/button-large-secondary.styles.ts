import { orange, white } from '../../../../config/styles';
import { ButtonStyleConfig } from '../../button-style.config';
import { buttonLargeSharedStyleConfig } from '../button-large.styles';

export const buttonLargeSecondaryStyleConfig: ButtonStyleConfig = {
  ...buttonLargeSharedStyleConfig,
  activeColorConfig: {
    titleColor: orange,
    backgroundColor: white,
    borderColor: orange
  }
};
