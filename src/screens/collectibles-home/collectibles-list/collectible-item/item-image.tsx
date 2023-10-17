import React, { memo } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { CollectibleImage } from 'src/components/collectible-image';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { isDefined } from 'src/utils/is-defined';

interface Props {
  slug: string;
  size: number;
  artifactUri?: string;
  areDetailsLoading: boolean;
}

export const CollectibleItemImage = memo<Props>(({ slug, size, artifactUri, areDetailsLoading }) => {
  const isAdultContent = useCollectibleIsAdultSelector(slug);

  if (isDefined(isAdultContent)) {
    if (isAdultContent) {
      return <ImageBlurOverlay size={size} />;
    }
  } else if (areDetailsLoading) {
    return <ActivityIndicator size="small" />;
  }

  return <CollectibleImage slug={slug} artifactUri={artifactUri} size={size} />;
});
