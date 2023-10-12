import { useCallback, useMemo, useState } from 'react';

import { showErrorToast } from 'src/toast/error-toast.utils';
import {
  ImageResolutionEnum,
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri
} from 'src/utils/image.utils';
import { isTruthy } from 'src/utils/is-truthy';

import { COLLECTIBLE_FINAL_FALLBACK } from '../constants';

export const useCollectibleImageControl = (assetSlug: string, artifactUri: string | undefined, isBigIcon: boolean) => {
  const [isAnimatedRenderedOnce, setIsAnimatedRenderedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageFallbackURLs = useMemo(
    () =>
      [
        artifactUri && formatCollectibleObjktArtifactUri(artifactUri),
        formatCollectibleObjktMediumUri(assetSlug),
        formatImgUri(artifactUri, ImageResolutionEnum.MEDIUM)
      ].filter(isTruthy),
    [assetSlug, artifactUri]
  );

  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(isBigIcon ? 0 : 1);
  const [currentFallback, setCurrentFallback] = useState(imageFallbackURLs[currentFallbackIndex]);

  const handleLoadEnd = useCallback(() => setIsLoading(false), []);

  const handleError = useCallback(() => {
    if (currentFallbackIndex < imageFallbackURLs.length - 1) {
      setCurrentFallback(imageFallbackURLs[currentFallbackIndex + 1]);
      setCurrentFallbackIndex(prevState => prevState + 1);
    } else {
      setCurrentFallback(COLLECTIBLE_FINAL_FALLBACK);
      handleLoadEnd();
    }
  }, [currentFallbackIndex, imageFallbackURLs, handleLoadEnd]);

  const handleAnimatedError = useCallback(() => {
    showErrorToast({ description: 'Invalid video' });
    setIsAnimatedRenderedOnce(true);
    setIsLoading(false);
  }, []);

  const handleAudioError = useCallback(() => {
    showErrorToast({ description: 'Invalid audio' });
    setIsAnimatedRenderedOnce(true);
    setIsLoading(false);
  }, []);

  return {
    isAnimatedRenderedOnce,
    currentFallback,
    isLoading,
    setIsLoading,
    handleError,
    handleLoadEnd,
    handleAnimatedError,
    handleAudioError
  };
};
