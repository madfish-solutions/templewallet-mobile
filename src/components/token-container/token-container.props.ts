import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { AssetInterface } from 'src/interfaces/asset.interface';

export interface TokenContainerProps {
  token: AssetInterface;
  leadingIcon?: ReactNode;
  showTokenTag?: boolean;
  apy?: number;
  scam?: boolean;
  style?: StyleProp<ViewStyle>;
}
