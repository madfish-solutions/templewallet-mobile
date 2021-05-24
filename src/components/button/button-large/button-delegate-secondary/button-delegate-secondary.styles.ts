import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonDelegateSecondaryStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.blue,
    backgroundColor: colors.white,
    borderColor: colors.blue
  }
}));
