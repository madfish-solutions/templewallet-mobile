import { uniq } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

import { useDidUpdate } from 'src/utils/hooks';
import { buildCollectibleImagesStack } from 'src/utils/image.utils';
import { isTruthy } from 'src/utils/is-truthy';

export const useCollectibleImagesStack = (
  assetSlug: string,
  artifactUri?: string,
  displayUri?: string,
  thumbnailUri?: string,
  isFullView?: boolean
) => {
  const sourcesStack = useMemo(
    () =>
      uniq(
        buildCollectibleImagesStack(assetSlug, { artifactUri, displayUri, thumbnailUri }, isFullView).filter(isTruthy)
      ),
    [assetSlug, artifactUri, displayUri, thumbnailUri, isFullView]
  );

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

  const src = sourcesStack[index] as string | undefined;

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
