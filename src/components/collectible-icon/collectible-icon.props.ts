import { StyleProp, ViewStyle } from 'react-native';

import { EventFn } from 'src/config/general';

import { CollectibleCommonInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { AudioPlaceholderTheme } from '../audio-placeholder/audio-placeholder';
import { ImageBlurOverlayThemesEnum } from '../image-blur-overlay/image-blur-overlay';
import { SimpleVideoProps } from '../simple-player/simple-player';

export interface CollectibleIconProps extends Pick<SimpleVideoProps, 'paused'> {
  collectible: TokenInterface & Pick<CollectibleCommonInterface, 'isAdultContent'>;
  size: number;
  mime?: string;
  objktArtifact?: string;
  iconSize?: CollectibleIconSize;
  audioPlaceholderTheme?: AudioPlaceholderTheme;
  setScrollEnabled?: EventFn<boolean>;
  blurLayoutTheme?: ImageBlurOverlayThemesEnum;
  isTouchableBlurOverlay?: boolean;
  isModalWindow?: boolean;
  isShowInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export enum CollectibleIconSize {
  SMALL = 'small',
  BIG = 'big'
}
