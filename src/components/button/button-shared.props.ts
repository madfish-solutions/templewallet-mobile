import { ViewStyle } from 'react-native';

import { EmptyFn } from '../../config/general';
import { IconNameEnum } from '../icon/icon-name.enum';

type MarginProps = Pick<ViewStyle, 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'>;

export interface ButtonSharedProps extends MarginProps {
  title?: string;
  iconName?: IconNameEnum;
  disabled?: boolean;
  onPress: EmptyFn;
}
