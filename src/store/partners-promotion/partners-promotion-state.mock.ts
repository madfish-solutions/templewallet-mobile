import { createEntity } from '../create-entity';
import { PartnersPromotionState } from './partners-promotion-state';

export const mockPartnersPromotion = {
  body: '',
  campaign_type: '',
  copy: {
    headline: '',
    cta: '',
    content: ''
  },
  display_type: '',
  div_id: '',
  html: [],
  id: '',
  image: '',
  link: '',
  nonce: '',
  text: '',
  view_time_url: '',
  view_url: ''
};

export const mockPartnersPromotionState: PartnersPromotionState = {
  promotion: createEntity(mockPartnersPromotion),
  isEnabled: false
};
