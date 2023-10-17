import React, { memo, useEffect, useState } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleMedia } from './collectible-media';

interface Props {
  slug: string;
  size: number;
  artifactUri?: string;
  displayUri?: string;
  mime?: string;
  areDetailsLoading: boolean;
  setScrollEnabled?: SyncFn<boolean>;
}

export const CollectibleImage = memo<Props>(
  ({ slug, size, artifactUri, displayUri, mime, areDetailsLoading, setScrollEnabled }) => {
    const isAdultContent = useCollectibleIsAdultSelector(slug);

    const [shouldShowBlur, setShouldShowBlur] = useState(isAdultContent ?? true);
    useEffect(() => void (isDefined(isAdultContent) && setShouldShowBlur(isAdultContent)), [isAdultContent]);

    if (isDefined(isAdultContent)) {
      if (shouldShowBlur) {
        return <ImageBlurOverlay size={size} isBigIcon={true} onPress={() => setShouldShowBlur(false)} />;
      }
    }

    if (areDetailsLoading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <CollectibleMedia
        slug={slug}
        artifactUri={artifactUri}
        displayUri={displayUri}
        mime={mime}
        size={size}
        setScrollEnabled={setScrollEnabled}
      />
    );
  }
);
