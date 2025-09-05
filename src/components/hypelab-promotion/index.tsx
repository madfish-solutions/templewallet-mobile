import React, { memo } from 'react';

import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { SingleProviderPromotionProps } from 'src/types/promotion';
import { HYPELAB_NATIVE_PLACEMENT_SLUG, HYPELAB_MEDIUM_PLACEMENT_SLUG } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';

import { WebViewPromotion } from '../webview-promotion';

const AD_CONTENT_RELATED_URL_SEARCH_PARAMS = ['campaign_slug', 'creative_set_slug', 'placement_slug'];

const adChanged = (prevUrl: string | undefined, newUrl: string) => {
  const prevAdHrefSearchParams = isDefined(prevUrl) ? new URL(prevUrl).searchParams : new URLSearchParams();
  const newAdHrefSearchParams = new URL(newUrl).searchParams;

  return AD_CONTENT_RELATED_URL_SEARCH_PARAMS.some(
    paramName => prevAdHrefSearchParams.get(paramName) !== newAdHrefSearchParams.get(paramName)
  );
};

export const HypelabPromotion = memo<SingleProviderPromotionProps>(({ variant, ...restProps }) => {
  const isImageAd = variant === PromotionVariantEnum.Image;

  return (
    <WebViewPromotion
      {...restProps}
      variant={variant}
      provider={PromotionProviderEnum.HypeLab}
      placementSlug={isImageAd ? HYPELAB_MEDIUM_PLACEMENT_SLUG : HYPELAB_NATIVE_PLACEMENT_SLUG}
      initialOriginalWidth={isImageAd ? 320 : undefined}
      initialOriginalHeight={isImageAd ? 100 : 80}
      adChanged={adChanged}
    />
  );
});
