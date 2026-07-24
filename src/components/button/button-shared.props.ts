import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { MarginProps } from 'src/interfaces/margin.props';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { IconNameEnum } from '../icon/icon-name.enum';

// TODO: Remove generic parameter after complete migration to new icon system
export interface ButtonSharedProps<IconName extends string = IconNameEnum> extends MarginProps, TestIdProps {
  title?: ReactNode;
  iconName?: IconName;
  disabled?: boolean;
  onPress: EmptyFn;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}
