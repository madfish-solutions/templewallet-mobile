import React, { memo } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { CollectibleImage } from 'src/components/collectible-image';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { isDefined } from 'src/utils/is-defined';

interface Props extends AssetMediaURIs {
  slug: string;
  size: number;
  areDetailsLoading: boolean;
}

export const CollectibleItemImage = memo<Props>(
  ({ slug, size, artifactUri, displayUri, thumbnailUri, areDetailsLoading }) => {
    const isAdultContent = useCollectibleIsAdultSelector(slug);

    if (isDefined(isAdultContent)) {
      if (isAdultContent) {
        return <ImageBlurOverlay size={size} />;
      }
    } else if (areDetailsLoading) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <CollectibleImage
        slug={slug}
        artifactUri={artifactUri}
        displayUri={displayUri}
        thumbnailUri={thumbnailUri}
        size={size}
      />
    );
  }
);
