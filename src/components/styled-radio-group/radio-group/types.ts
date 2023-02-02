import { ViewStyle } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';

type StyleType = ViewStyle | (ViewStyle | undefined)[];

export interface RadioItemInterface {
  value: string;
  label?: string;
  buttons?: ItemButtonInterface[];
}

export interface RadioItemProps extends RadioItemInterface {
  selected?: boolean;
  color: string;
  containerStyle?: StyleType;
  labelStyle?: StyleType;
  onPress?: (value: string) => void;
}

export interface RadioGroupProps {
  items: RadioItemInterface[];
  value?: string;
  color?: string;
  itemContainerStyle?: StyleType;
  itemLabelStyle?: StyleType;
  onPress: (value: string) => void;
}

export interface ItemButtonInterface {
  key: string;
  iconName: IconNameEnum;
  disabled?: boolean;
  onPress: () => void;
}
