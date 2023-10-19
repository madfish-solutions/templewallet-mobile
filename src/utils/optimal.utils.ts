import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { mockPartnersPromotion } from 'src/store/partners-promotion/partners-promotion-state.mock';

import { optimalApi } from '../api.service';

export enum OptimalPromotionAdType {
  TwMobile = 'tw-mobile',
  TwToken = 'tw-token'
}

type EmptyPromotion = Record<string, undefined>;
type NormalPromotion = {
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

export function useIsEmptyPromotion(promotion: OptimalPromotionType): promotion is EmptyPromotion {
  return useMemo(
    () =>
      !('link' in promotion && 'image' in promotion && 'copy' in promotion) ||
      isEqual(mockPartnersPromotion, promotion),
    [promotion]
  );
}

function assertIsObject(likelyAnObject: unknown): void {
  const isLikelyAnObject =
    typeof likelyAnObject === 'object' && likelyAnObject !== null && !Array.isArray(likelyAnObject);

  if (!isLikelyAnObject) {
    throw new Error('Received value is not an object');
  }
}

export const getOptimalPromotion = (adType: OptimalPromotionAdType, address: string) =>
  optimalApi
    .get<OptimalPromotionType>('api/v1/decision', {
      params: {
        publisher: 'templewallet', // your-publisher-slug
        ad_types: adType,
        div_ids: 'ad',
        wallets: `1729:${address}`
      }
    })
    .then(response => {
      const { data } = response;
      assertIsObject(data);

      return data;
    });
