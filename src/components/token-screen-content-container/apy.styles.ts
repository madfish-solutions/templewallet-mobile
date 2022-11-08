import { ViewStyle } from 'react-native';

import { createUseStyles } from '../../styles/create-use-styles';
import { TZ_BTC_TOKEN_SLUG, KUSD_SLUG } from '../../token/data/token-slugs';

export const useApyStyles = createUseStyles(
  ({ colors }): Record<string, ViewStyle> => ({
    [KUSD_SLUG]: {
      backgroundColor: colors.liteGreen
    },
    [TZ_BTC_TOKEN_SLUG]: {
      backgroundColor: colors.blue
    }
  })
);
