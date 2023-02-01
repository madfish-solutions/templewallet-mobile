import { IconNameEnum } from 'src/components/icon/icon-name.enum';

export interface RadioItemInterface {
  borderColor?: string;
  color?: string;
  containerStyle?: object;
  description?: string;
  descriptionStyle?: object;
  disabled?: boolean;
  id: string;
  label?: string;
  labelStyle?: object;
  layout?: 'row' | 'column';
  onPress?: (id: string) => void;
  selected?: boolean;
  size?: number;
  value?: string;
  buttons?: ItemButtonInterface[];
}

export type RadioGroupProps = {
  containerStyle?: object;
  layout?: 'row' | 'column';
  onPress?: (items: RadioItemInterface[]) => void;
  items: RadioItemInterface[];
};

export interface ItemButtonInterface {
  key: string;
  iconName: IconNameEnum;
  disabled?: boolean;
  onPress: () => void;
}
