import { ViewStyle } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';

type StyleType = ViewStyle | (ViewStyle | undefined)[];

export interface RadioItemInterface<T extends string> {
  value: T;
  label?: string;
  buttons?: ItemButtonInterface[];
}

export interface RadioItemProps extends RadioItemInterface<string> {
  selected?: boolean;
  color: string;
  containerStyle?: StyleType;
  labelStyle?: StyleType;
  onPress?: (value: string) => void;
}

export interface RadioGroupProps<T extends string> {
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
