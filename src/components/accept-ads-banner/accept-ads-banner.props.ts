import { StyleProp, ViewStyle } from 'react-native';

import { EmptyFn } from 'src/config/general';

export interface BannerProps {
  style?: StyleProp<ViewStyle>;
}

export interface BannerGroupProps extends BannerProps {
  onEnable: EmptyFn;
  onDisable: EmptyFn;
}
