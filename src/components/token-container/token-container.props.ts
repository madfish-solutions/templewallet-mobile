import { StyleProp, ViewStyle } from 'react-native';

import { TokenInterface } from 'src/token/interfaces/token.interface';

export interface TokenContainerProps {
  token: TokenInterface;
  apy?: number;
  scam?: boolean;
  style?: StyleProp<ViewStyle>;
}
