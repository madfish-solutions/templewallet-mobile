import { EventFn } from 'src/config/general';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export interface CollectibleIconProps {
  collectible: TokenInterface;
  size: number;
  mime?: string;
  objktArtifact?: string;
  iconSize?: CollectibleIconSize;
  setScrollEnabled?: EventFn<boolean>;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
