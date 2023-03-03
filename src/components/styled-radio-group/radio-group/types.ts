import { ViewStyle } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';

import { TestIdProps } from '../../../interfaces/test-id.props';

type StyleType = ViewStyle | (ViewStyle | undefined)[];

export interface RadioItemInterface<T extends string> {
  value: T;
  label?: string;
  buttons?: ItemButtonInterface[];
}

export interface RadioItemProps extends RadioItemInterface<string>, TestIdProps {
  selected?: boolean;
  color: string;
  containerStyle?: StyleType;
  labelStyle?: StyleType;
  onPress?: (value: string) => void;
}

export interface RadioGroupProps<T extends string> extends TestIdProps {
  items: RadioItemInterface<T>[];
  value?: T;
  color?: string;
  itemContainerStyle?: StyleType;
  itemLabelStyle?: StyleType;
  onPress: (value: T) => void;
}

export interface ItemButtonInterface {
  key: string;
  iconName: IconNameEnum;
  disabled?: boolean;
  onPress: () => void;
}
