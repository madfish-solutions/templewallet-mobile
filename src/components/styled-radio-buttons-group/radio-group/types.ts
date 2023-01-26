export interface ItemProps extends RadioItemInterface {
  onEditPress?: (id: string) => void;
}

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
  editDisabled?: boolean;
}

export type RadioGroupProps = {
  containerStyle?: object;
  layout?: 'row' | 'column';
  onPress?: (items: RadioItemInterface[]) => void;
  onEditButtonPress?: (id: string) => void;
  items: RadioItemInterface[];
};
