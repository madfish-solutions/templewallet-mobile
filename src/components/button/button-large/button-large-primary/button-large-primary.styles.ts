import { orange, white } from '../../../../config/styles';
import { ButtonStyleConfig } from '../../button';
import { buttonLargeSharedStyleConfig } from '../button-large.styles';

export const buttonLargePrimaryStyleConfig: ButtonStyleConfig = {
  ...buttonLargeSharedStyleConfig,
  activeColorConfig: {
    titleColor: white,
    backgroundColor: orange
  }
};
