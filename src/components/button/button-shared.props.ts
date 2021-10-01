import { EmptyFn } from '../../config/general';
import { MarginProps } from '../../interfaces/margin.props';
import { TestIdProps } from '../../interfaces/test-id.props';
import { IconNameEnum } from '../icon/icon-name.enum';

export interface ButtonSharedProps extends MarginProps, TestIdProps {
  title?: string;
  iconName?: IconNameEnum;
  disabled?: boolean;
  onPress: EmptyFn;
}
