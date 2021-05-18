import { EmptyFn } from '../../config/general';
import { MarginProps } from '../../interfaces/margin.props';
import { IconNameEnum } from '../icon/icon-name.enum';

export interface ButtonSharedProps extends MarginProps {
  title?: string;
  iconName?: IconNameEnum;
  disabled?: boolean;
  onPress: EmptyFn;
}
