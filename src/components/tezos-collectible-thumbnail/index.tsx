import React, { ComponentType, memo } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { CollectibleImage } from 'src/components/collectible-image';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  useCollectibleDetailsLoadingSelector,
  useCollectibleDetailsSelector,
  useCollectibleIsAdultSelector
} from 'src/store/collectibles/collectibles-selectors';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

interface Props extends AssetMediaURIs {
  slug: string;
  size: number;
  blurAdultContent?: boolean;
  Fallback?: ComponentType<{ isFullView?: boolean }>;
  resizeMode?: 'contain' | 'cover';
}

export const TezosCollectibleThumbnail = memo<Props>(
  ({ slug, size, artifactUri, displayUri, thumbnailUri, blurAdultContent = true, Fallback, resizeMode }) => {
    const details = useCollectibleDetailsSelector(slug);
    const areDetailsLoading = useCollectibleDetailsLoadingSelector();
    const isAdultContent = useCollectibleIsAdultSelector(slug);

    if (blurAdultContent && !isDefined(isAdultContent) && areDetailsLoading && details === undefined) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <CollectibleImage
        chainKind={TempleChainKind.Tezos}
        slug={slug}
        artifactUri={
          details?.artifactUri != null &&
          (isSvgDataUriInBase64Encoding(details.artifactUri) || artifactUri === 'UNSUPPORTED_EXTENSION')
            ? details.artifactUri
            : artifactUri
        }
        displayUri={displayUri ?? details?.displayUri}
        thumbnailUri={thumbnailUri ?? details?.thumbnailUri}
        size={size}
        isBlurred={blurAdultContent && isAdultContent === true}
        Fallback={Fallback}
        resizeMode={resizeMode}
      />
    );
  }
);
