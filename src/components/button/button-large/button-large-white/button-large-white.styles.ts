import { createUseStylesConfig } from '../../../../styles/create-use-styles';
import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonLargeWhiteStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: '#ffffff',
    backgroundColor: colors.orange
  }
}));
