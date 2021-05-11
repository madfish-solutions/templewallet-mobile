import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { ButtonStyleConfig } from '../../button-style.config';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargeSecondaryStyleConfig = createUseStylesConfig<ButtonStyleConfig>(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.white,
    borderColor: colors.orange
  }
}));
