import { AdFrameMessageType } from 'src/enums/ad-frame-message-type.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';

export interface SingleProviderPromotionProps extends TestIdProps {
  variant: PromotionVariantEnum;
  isVisible: boolean;
  shouldShowCloseButton: boolean;
  onClose: EmptyFn;
  onReady: EmptyFn;
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

interface ReadyAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Ready;
  ad: { cta_url: string };
}

interface ErrorAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Error;
  reason?: string;
}

interface ClickAdMessage extends AdFrameMessageBase {
  type: AdFrameMessageType.Click;
}

export type AdFrameMessage = ResizeAdMessage | ReadyAdMessage | ErrorAdMessage | ClickAdMessage;
