import React, { memo, useState } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { AssetMediaURIs } from 'src/utils/assets/types';

import { CollectibleMedia } from './collectible-media';

interface Props extends AssetMediaURIs {
  slug: string;
  size: number;
  mime?: string;
  areDetailsLoading: boolean;
  setScrollEnabled?: SyncFn<boolean>;
}

export const CollectibleImage = memo<Props>(
  ({ slug, size, artifactUri, displayUri, thumbnailUri, mime, areDetailsLoading, setScrollEnabled }) => {
    const isAdultContent = useCollectibleIsAdultSelector(slug);

    const [shouldShowBlur = isAdultContent, setShouldShowBlur] = useState<boolean>();

    if (isAdultContent && shouldShowBlur) {
      return <ImageBlurOverlay size={size} isBigIcon={true} onPress={() => setShouldShowBlur(false)} />;
    }

    if (areDetailsLoading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <CollectibleMedia
        slug={slug}
        artifactUri={artifactUri}
        displayUri={displayUri}
        thumbnailUri={thumbnailUri}
        mime={mime}
        size={size}
        setScrollEnabled={setScrollEnabled}
      />
    );
  }
);
