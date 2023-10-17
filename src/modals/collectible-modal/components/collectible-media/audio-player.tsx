import React, { FC, memo, useMemo } from 'react';

import { AudioPlaceholder, AudioPlaceholderTheme } from 'src/components/audio-placeholder';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { formatCollectibleObjktArtifactUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

interface Props {
  artifactUri: string;
  displayUri: string | undefined;
  handleLoadEnd: EmptyFn;
  handleAudioError: EmptyFn;
  audioPlaceholderTheme?: AudioPlaceholderTheme;
}

export const AudioPlayer: FC<Props> = memo(
  ({ artifactUri, displayUri, handleLoadEnd, handleAudioError, audioPlaceholderTheme, children }) => {
    const finalImage = useMemo(() => {
      if (!isDefined(displayUri)) {
        return <AudioPlaceholder theme={audioPlaceholderTheme} />;
      }

      return children;
    }, [displayUri, children]);

    return (
      <>
        <SimplePlayer
          uri={formatCollectibleObjktArtifactUri(artifactUri)}
          // We don't need size if the NFT has mime 'audio'
          size={0}
          onError={handleAudioError}
          onLoad={handleLoadEnd}
        />

        {finalImage}
      </>
    );
  }
);
