import { white } from 'src/config/styles';
import { createUseStylesConfig } from 'src/styles/create-use-styles';

import { useButtonLargeSharedStyleConfig } from '../button-large.styles';

export const useButtonDelegatePrimaryStyleConfig = createUseStylesConfig(({ colors }) => ({
  ...useButtonLargeSharedStyleConfig(),
  activeColorConfig: {
    titleColor: white,
    backgroundColor: colors.blue
  }
}));
