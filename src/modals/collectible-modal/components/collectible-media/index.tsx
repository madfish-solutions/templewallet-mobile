import React, { FC, memo, useMemo, useState } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { AudioPlaceholder } from 'src/components/audio-placeholder';
import { CollectibleImage } from 'src/components/collectible-image';
import { SimpleModelView } from 'src/components/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { useDidUpdate } from 'src/utils/hooks';
import { buildObjktCollectibleArtifactUris } from 'src/utils/image.utils';

import { useCollectibleMediaStyles } from './styles';

interface Props extends MediaContentProps {
  areDetailsLoading: boolean;
}

export const CollectibleMedia = memo<Props>(({ slug, size, areDetailsLoading, ...props }) => {
  const isAdultContent = useCollectibleIsAdultSelector(slug);

  const [shouldShowBlur = isAdultContent, setShouldShowBlur] = useState<boolean>();

  if (isAdultContent && shouldShowBlur) {
    return (
      <CollectibleImage
        chainKind={TempleChainKind.Tezos}
        isFullView
        size={size}
        slug={slug}
        artifactUri={props.artifactUri}
        displayUri={props.displayUri}
        thumbnailUri={props.thumbnailUri}
        isBlurred
        onReveal={() => setShouldShowBlur(false)}
      />
    );
  }

  if (areDetailsLoading) {
    return <ActivityIndicator size="large" />;
  }

  return <MediaContent slug={slug} size={size} {...props} />;
});

interface MediaContentProps extends AssetMediaURIs {
  slug: string;
  size: number;
  mime?: string;
  setScrollEnabled?: SyncFn<boolean>;
}

const MediaContent = memo<MediaContentProps>(
  ({ slug, size, artifactUri, displayUri, thumbnailUri, mime, setScrollEnabled }) => {
    const styles = useCollectibleMediaStyles();

    const mediaUris = useMemo(
      () => (artifactUri ? buildObjktCollectibleArtifactUris(artifactUri, mime === 'application/x-directory') : []),
      [artifactUri, mime]
    );

    const { src: mediaUri, isStackFailed, onFail: onMediaFail } = useImagesStack(mediaUris);

    useDidUpdate(() => {
      if (isStackFailed && mediaUris.length > 0) {
        showErrorToast({ description: `Invalid ${getMediaSubject(mime)}` });
      }
    }, [isStackFailed, mediaUris, mime]);

    if (mime && mediaUri) {
      if (mime === 'model/gltf-binary') {
        return (
          <SimpleModelView
            key={mediaUri}
            uri={mediaUri}
            isBinary={true}
            style={styles.container}
            onFail={onMediaFail}
            setScrollEnabled={setScrollEnabled}
          />
        );
      }
      if (mime === 'application/x-directory') {
        return (
          <SimpleModelView
            key={mediaUri}
            uri={mediaUri}
            isBinary={false}
            style={styles.container}
            onFail={onMediaFail}
            setScrollEnabled={setScrollEnabled}
          />
        );
      }
      if (mime.startsWith('video/')) {
        return <SimplePlayer key={mediaUri} uri={mediaUri} width={size} height={size} onError={onMediaFail} isVideo />;
      }
      if (mime.startsWith('audio/')) {
        return (
          <View style={styles.audioContainer}>
            <CollectibleImage
              chainKind={TempleChainKind.Tezos}
              isFullView
              size={size}
              slug={slug}
              artifactUri={artifactUri}
              displayUri={displayUri}
              thumbnailUri={thumbnailUri}
              Fallback={AudioPlaceholderLocal}
            />
            <SimplePlayer
              key={mediaUri}
              uri={mediaUri}
              width={size}
              height={size}
              onError={onMediaFail}
              style={styles.audio}
            />
          </View>
        );
      }
    }

    return (
      <CollectibleImage
        chainKind={TempleChainKind.Tezos}
        isFullView
        size={size}
        slug={slug}
        artifactUri={artifactUri}
        displayUri={displayUri}
        thumbnailUri={thumbnailUri}
      />
    );
  }
);

const AudioPlaceholderLocal: FC<{ isFullView?: boolean }> = () => <AudioPlaceholder />;

const getMediaSubject = (mime?: string) => {
  if (mime === 'model/gltf-binary') {
    return '3D model';
  }
  if (mime?.startsWith('video/')) {
    return 'video';
  }
  if (mime?.startsWith('audio/')) {
    return 'audio';
  }

  return 'media';
};
