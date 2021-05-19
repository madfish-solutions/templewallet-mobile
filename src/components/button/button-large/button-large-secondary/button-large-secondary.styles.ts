import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargeSecondaryStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.white,
    borderColor: colors.orange
  }
}));
