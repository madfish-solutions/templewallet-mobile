import { TokenInterface } from '../../token/interfaces/token.interface';

export interface CollectibleIconProps {
  collectible?: TokenInterface;
  size: number;
  iconSize?: CollectibleIconSize;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
