import React, { memo } from 'react';

import { ActivityIndicator } from 'src/components/activity-indicator/activity-indicator';
import { CollectibleIcon } from 'src/components/collectible-icon/collectible-icon';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { emptyFn } from 'src/config/general';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { isDefined } from 'src/utils/is-defined';

interface Props {
  slug: string;
  size: number;
  artifactUri?: string;
  displayUri?: string;
  mime?: string;
  areDetailsLoading: boolean;
}

export const CollectibleItemImage = memo<Props>(({ slug, size, artifactUri, displayUri, mime, areDetailsLoading }) => {
  const isAdultContent = useCollectibleIsAdultSelector(slug);
  const isAdultFlagLoading = areDetailsLoading && !isDefined(isAdultContent);

  if (isAdultFlagLoading) {
    return <ActivityIndicator size="small" />;
  }

  if (isAdultContent) {
    return <ImageBlurOverlay size={size} isBigIcon={false} isShowBlur={true} setIsShowBlur={emptyFn} />;
  }

  // TODO: Too heavy here. Might wanna lighter component
  return (
    <CollectibleIcon slug={slug} artifactUri={artifactUri} displayUri={displayUri} mime={mime || ''} size={size} />
  );
});
