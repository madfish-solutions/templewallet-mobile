import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { EmptyFn } from 'src/config/general';
import { MarginProps } from 'src/interfaces/margin.props';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { IconNameEnum } from '../icon/icon-name.enum';

export interface ButtonSharedProps extends MarginProps, TestIdProps {
  title?: ReactNode;
  iconName?: IconNameEnum;
  disabled?: boolean;
  onPress: EmptyFn;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}
