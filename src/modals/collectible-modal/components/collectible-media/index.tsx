import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { AudioPlaceholder } from 'src/components/audio-placeholder';
import { CollectibleImage } from 'src/components/collectible-image';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { SimpleModelView } from 'src/components/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player';
import { useCollectibleIsAdultSelector } from 'src/store/collectibles/collectibles-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { useDidUpdate } from 'src/utils/hooks';
import { formatCollectibleArtifactUri } from 'src/utils/image.utils';

import { useCollectibleMediaStyles } from './styles';

interface Props extends MediaContentProps {
  areDetailsLoading: boolean;
}

export const CollectibleMedia = memo<Props>(({ slug, size, areDetailsLoading, ...props }) => {
  const isAdultContent = useCollectibleIsAdultSelector(slug);

  const [shouldShowBlur = isAdultContent, setShouldShowBlur] = useState<boolean>();

  if (isAdultContent && shouldShowBlur) {
    return <ImageBlurOverlay size={size} isBigIcon={true} onPress={() => setShouldShowBlur(false)} />;
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

    const mediaUri = useMemo(
      () => (artifactUri ? formatCollectibleArtifactUri(artifactUri) : undefined),
      [artifactUri]
    );

    const [mediaFailed, setMediaFailed] = useState(false);
    useDidUpdate(() => setMediaFailed(false), [mime, mediaUri]);

    const onMediaFail = useCallback((subject = 'media') => {
      showErrorToast({ description: `Invalid ${subject}` });
      setMediaFailed(true);
    }, []);
    const onModelMediaFail = useCallback(() => onMediaFail('3D model'), [onMediaFail]);
    const onVideoMediaFail = useCallback(() => onMediaFail('video'), [onMediaFail]);
    const onAudioMediaFail = useCallback(() => onMediaFail('audio'), [onMediaFail]);

    if (!mediaFailed && mime && mediaUri) {
      if (mime === 'model/gltf-binary') {
        return (
          <SimpleModelView
            uri={mediaUri}
            isBinary={true}
            style={styles.container}
            onFail={onModelMediaFail}
            setScrollEnabled={setScrollEnabled}
          />
        );
      }
      if (mime === 'application/x-directory') {
        return (
          <SimpleModelView
            uri={mediaUri}
            isBinary={false}
            style={styles.container}
            onFail={onMediaFail}
            setScrollEnabled={setScrollEnabled}
          />
        );
      }
      if (mime.startsWith('video/')) {
        return <SimplePlayer uri={mediaUri} width={size} height={size} onError={onVideoMediaFail} isVideo />;
      }
      if (mime.startsWith('audio/')) {
        return (
          <View style={styles.audioContainer}>
            <CollectibleImage
              isFullView
              size={size}
              slug={slug}
              artifactUri={artifactUri}
              displayUri={displayUri}
              thumbnailUri={thumbnailUri}
              Fallback={AudioPlaceholderLocal}
            />
            <SimplePlayer uri={mediaUri} width={size} height={size} onError={onAudioMediaFail} style={styles.audio} />
          </View>
        );
      }
    }

    return (
      <CollectibleImage
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
