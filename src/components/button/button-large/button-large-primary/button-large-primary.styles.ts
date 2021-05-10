import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { ButtonStyleConfig } from '../../button-style.config';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargePrimaryStyleConfig = createUseStylesConfig<ButtonStyleConfig>(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.orange
  }
}));
