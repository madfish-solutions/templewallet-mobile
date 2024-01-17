import { IconNameEnum } from 'src/components/icon/icon-name.enum';

export interface ImportType {
  title: string;
  description: string;
  iconName: IconNameEnum;
  onPress: EmptyFn;
}
