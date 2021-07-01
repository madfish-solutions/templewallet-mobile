import { black } from '../../../config/styles';
import { createUseStylesConfig } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';
import { ButtonStyleConfig } from '../button-style.config';

export const useButtonSmallSharedStyleConfig = createUseStylesConfig<Omit<ButtonStyleConfig, 'activeColorConfig'>>(
  ({ typography }) => ({
    containerStyle: {
      ...generateShadow(1, black),
      height: formatSize(26),
      paddingHorizontal: formatSize(8),
      borderRadius: formatSize(17)
    },
    titleStyle: {
      ...typography.tagline13Tag
    }
  })
);
