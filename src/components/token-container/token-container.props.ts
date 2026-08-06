import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { TokenInterface } from 'src/token/interfaces/token.interface';

export interface TokenContainerProps {
  token: TokenInterface;
  leadingIcon?: ReactNode;
  showTokenTag?: boolean;
  apy?: number;
  scam?: boolean;
  style?: StyleProp<ViewStyle>;
}
