import { TokenInterface } from '../../token/interfaces/token.interface';

export interface CollectibleIconProps {
  collectible: TokenInterface;
  size: number;
  mime?: string;
  objktArtifact?: string;
  iconSize?: CollectibleIconSize;
  setScrollEnabled?: (value: boolean) => void;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
