import { ButtonSharedProps } from '../button-shared.props';

export interface ButtonSmallProps extends Omit<ButtonSharedProps, 'iconName'> {
  title: string;
}
