import { StyleProp, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';

import { CollectibleCommonInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { ImageBlurOverlayThemesEnum } from '../image-blur-overlay/image-blur-overlay';

export interface CollectibleIconProps {
  collectible: TokenInterface & Pick<CollectibleCommonInterface, 'isAdultContent'>;
  size: number;
  mime?: string;
  objktArtifact?: string;
  iconSize?: CollectibleIconSize;
  setScrollEnabled?: EventFn<boolean>;
  blurLayoutTheme?: ImageBlurOverlayThemesEnum;
  isTouchableBlurOverlay?: boolean;
  isShowInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
