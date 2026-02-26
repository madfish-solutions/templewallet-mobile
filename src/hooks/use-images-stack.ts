import { useCallback, useMemo, useState } from 'react';

import { useDidUpdate } from 'src/utils/hooks';
import { buildCollectibleImagesStack, buildTokenImagesStack } from 'src/utils/image.utils';

export const useCollectibleImagesStack = (
  assetSlug: string,
  artifactUri?: string,
  displayUri?: string,
  thumbnailUri?: string,
  isFullView?: boolean
) => {
  const sourcesStack = useMemo(
    () => buildCollectibleImagesStack(assetSlug, { artifactUri, displayUri, thumbnailUri }, isFullView),
    [assetSlug, artifactUri, displayUri, thumbnailUri, isFullView]
  );

  return useImagesStack(sourcesStack);
};

export const useTokenImagesStack = (url: string, preferDirectSource = false) => {
  const sourcesStack = useMemo(() => buildTokenImagesStack(url, preferDirectSource), [url, preferDirectSource]);

  return useImagesStack(sourcesStack);
};

const useImagesStack = (sourcesStack: string[]) => {
  const emptyStack = sourcesStack.length < 1;

  const [isLoading, setIsLoading] = useState(emptyStack === false);
  const [isStackFailed, setIsStackFailed] = useState(emptyStack);

  useDidUpdate(() => {
    const emptyStack = sourcesStack.length < 1;

    setIndex(emptyStack ? -1 : 0);
    setIsLoading(emptyStack === false);
    setIsStackFailed(emptyStack);
  }, [sourcesStack]);

  const [index, setIndex] = useState(emptyStack ? -1 : 0);

  const src = sourcesStack[index];

  const onSuccess = useCallback(() => void setIsLoading(false), []);

  const onFail = useCallback(() => {
    if (isStackFailed) {
      return;
    }

    if (index + 1 === sourcesStack.length) {
      setIndex(-1);
      setIsLoading(false);
      setIsStackFailed(true);

      return;
    }

    setIndex(index + 1);
  }, [isStackFailed, sourcesStack.length, index]);

  return {
    src,
    isLoading,
    isStackFailed,
    onSuccess,
    onFail
  };
};
