import React, { memo } from 'react';

import { WebViewPromotion } from 'src/components/webview-promotion';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { SingleProviderPromotionProps } from 'src/types/promotion';
import { PERSONA_PLACEMENT_SLUG } from 'src/utils/env.utils';

const adChanged = () => true;

export const PersonaPromotion = memo<SingleProviderPromotionProps>(({ variant, ...restProps }) => {
  if (variant === PromotionVariantEnum.Text) {
    return null;
  }

  return (
    <WebViewPromotion
      {...restProps}
      variant={variant}
      provider={PromotionProviderEnum.Persona}
      placementSlug={PERSONA_PLACEMENT_SLUG}
      initialOriginalWidth={321}
      initialOriginalHeight={101}
      adChanged={adChanged}
    />
  );
});
