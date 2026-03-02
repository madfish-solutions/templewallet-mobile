import { createUseStylesConfig } from 'src/styles/create-use-styles';

import { useButtonSmallSharedStyleConfig } from '../button-small.styles';

export const useButtonSmallDelegateStyles = createUseStylesConfig(({ colors }) => ({
  ...useButtonSmallSharedStyleConfig(),
  activeColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.blue
  }
}));
