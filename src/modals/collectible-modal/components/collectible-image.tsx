import React, { memo, useEffect, useState } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator/activity-indicator';
import { CollectibleMediaImage } from 'src/components/collectible-icon/collectible-icon';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { EventFn } from 'src/config/general';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { isDefined } from 'src/utils/is-defined';

interface Props {
  slug: string;
  size: number;
  artifactUri?: string;
  displayUri?: string;
  mime?: string;
  areDetailsLoading: boolean;
  setScrollEnabled?: EventFn<boolean>;
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
      <CollectibleMediaImage
        slug={slug}
        artifactUri={artifactUri}
        displayUri={displayUri}
        mime={mime}
        size={size}
        isBigIcon={true}
        setScrollEnabled={setScrollEnabled}
      />
    );
  }
);
