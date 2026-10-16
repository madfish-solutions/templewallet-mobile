import { createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { ButtonStyleConfig } from '../button-style.config';

// TODO: Get rid of this function when useButtonMediumStyleConfig is not used anymore
function createUseButtonMediumStyleConfig<Size extends number>(
  iconSize: Size
): () => Required<ButtonStyleConfig<Size>> {
  return createUseStylesConfig(({ colors, typography }) => ({
    containerStyle: {
      height: formatSize(38),
      borderRadius: formatSize(8)
    },
    titleStyle: {
      ...typography.tagline13Tag
    },
    iconStyle: {
      size: iconSize,
      marginRight: formatSize(2)
    },
    activeColorConfig: {
      titleColor: colors.orange,
      backgroundColor: colors.orange10
    },
    disabledColorConfig: {
      titleColor: colors.disabled,
      backgroundColor: colors.gray4
    }
  }));
}

export const useButtonMediumStyleConfig = createUseButtonMediumStyleConfig(formatSize(16));
export const useButtonMediumStyleConfigV2 = createUseButtonMediumStyleConfig(16);
