import React, { FC, memo, useMemo } from 'react';

import { EmptyFn } from '../../../../config/general';
import { formatCollectibleObjktArtifactUri } from '../../../../utils/image.utils';
import { isDefined } from '../../../../utils/is-defined';
import { AudioPlaceholder, AudioPlaceholderTheme } from '../../../audio-placeholder/audio-placeholder';
import { SimplePlayer } from '../../../simple-player/simple-player';

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
