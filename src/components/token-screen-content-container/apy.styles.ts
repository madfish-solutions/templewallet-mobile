import { ViewStyle } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

export const useApyStyles = createUseStyles(
  ({ colors }): Record<string, ViewStyle> => ({
    [KNOWN_TOKENS_SLUGS.KUSD]: {
      backgroundColor: colors.liteGreen
    },
    [KNOWN_TOKENS_SLUGS.tzBTC]: {
      backgroundColor: colors.blue
    }
  })
);
