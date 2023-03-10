import { optimalApi } from '../api.service';

export interface OptimalPromotionInterface {
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
}

export const getOptimalPromotion = () =>
  optimalApi
    .get<OptimalPromotionInterface>('api/v1/decision', {
      params: {
        publisher: 'templewallet', // your-publisher-slug
        ad_types: 'tw-mobile', // tw-fullview | tw-popup | tw-mobile
        div_ids: 'ad'
      }
    })
    .then(response => response.data);
