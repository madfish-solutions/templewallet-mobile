import { optimalApi } from '../api.service';

export enum OptimalPromotionAdType {
  TwMobile = 'tw-mobile',
  TwToken = 'tw-token'
}

export type EmptyPromotion = Record<string, never>;
export type NormalPromotion = {
  body: string;
  campaign_type: string;
  copy: {
    headline: string;
    cta: string;
    content: string;
  };
  display_type: string;
  div_id: string;
  html: Array<string>;
  id: string;
  image: string;
  link: string;
  nonce: string;
  text: string;
  view_time_url: string;
  view_url: string;
};
export type OptimalPromotionType = EmptyPromotion | NormalPromotion;

export const getOptimalPromotion = (adType: OptimalPromotionAdType) =>
  optimalApi
    .get<OptimalPromotionType>('api/v1/decision', {
      params: {
        publisher: 'templewallet', // your-publisher-slug
        ad_types: adType,
        div_ids: 'ad'
      }
    })
    .then(response => response.data);
