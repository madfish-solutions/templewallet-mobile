import { useCallback, useMemo, useState } from 'react';

import { showErrorToast } from 'src/toast/error-toast.utils';
import { buildCollectibleImagesStack } from 'src/utils/image.utils';
import { isTruthy } from 'src/utils/is-truthy';

export const COLLECTIBLE_FINAL_FALLBACK = 'FINAL_FALLBACK';

export const useCollectibleImageControl = (
  assetSlug: string,
  artifactUri: string | undefined,
  displayUri: string | undefined
) => {
  const [isAnimatedRenderedOnce, setIsAnimatedRenderedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageFallbackURLs = useMemo(
    () => buildCollectibleImagesStack(assetSlug, artifactUri, displayUri, true).filter(isTruthy),
    // [
    //   artifactUri && formatCollectibleObjktArtifactUri(artifactUri),
    //   formatCollectibleObjktMediumUri(assetSlug),
    //   formatImgUri(artifactUri, 'medium')
    // ].filter(isTruthy),
    [assetSlug, artifactUri, displayUri]
  );

  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
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
