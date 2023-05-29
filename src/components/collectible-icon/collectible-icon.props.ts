import { TokenInterface } from '../../token/interfaces/token.interface';

export interface CollectibleIconProps {
  collectible: TokenInterface;
  size: number;
  mime?: string;
  objktArtifact?: string;
  iconSize?: CollectibleIconSize;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
