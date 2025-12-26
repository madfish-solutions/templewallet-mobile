import { AdFrameMessageType } from 'src/enums/ad-frame-message-type.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';

export interface SingleProviderPromotionProps extends TestIdProps {
  variant: PromotionVariantEnum;
  isVisible: boolean;
  shouldShowCloseButton: boolean;
  onClose: EmptyFn;
  onReady: EmptyFn;
  onImpression: EmptyFn;
  onError: EmptyFn;
}

interface AdFrameMessageBase {
  type: AdFrameMessageType;
}

interface ResizeAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Resize;
  width: number;
  height: number;
}

interface ImageCreativeSet {
  image: {
    url: string;
    height: number;
    width: number;
  };
}

interface VideoCreativeSet {
  video: {
    url: string;
    height: number;
    width: number;
  };
}

type CreativeSet = ImageCreativeSet | VideoCreativeSet;

interface ReadyAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Ready;
  ad: { cta_url: string; creative_set?: CreativeSet };
}

interface ErrorAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Error;
  reason?: string;
}

interface ClickAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Click;
}

interface ImpressionAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Impression;
}

export type AdFrameMessage = ResizeAdMessage | ReadyAdMessage | ErrorAdMessage | ClickAdMessage | ImpressionAdMessage;
