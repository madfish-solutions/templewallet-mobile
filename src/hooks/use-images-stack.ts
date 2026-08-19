import { useCallback, useMemo, useState } from 'react';

import { useDidUpdate } from 'src/utils/hooks';
import {
  buildCollectibleImagesStack,
  buildEvmCollectibleImagesStack,
  buildEvmTokenIconSources,
  buildTokenImagesStack
} from 'src/utils/image.utils';

export interface TezosTokenImagesStackParams {
  thumbnailUri?: string;
}

export interface EvmTokenImagesStackParams {
  address: string;
  chainId: number;
  iconURL?: string;
  isCollectible?: boolean;
}

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

export const useTezosTokenImagesStack = ({ thumbnailUri = '' }: TezosTokenImagesStackParams) => {
  const sourcesStack = useMemo(() => buildTokenImagesStack(thumbnailUri), [thumbnailUri]);

  return useImagesStack(sourcesStack);
};

export const useEvmTokenImagesStack = ({
  address,
  chainId,
  iconURL,
  isCollectible = false
}: EvmTokenImagesStackParams) => {
  const sourcesStack = useMemo(
    () =>
      isCollectible ? buildEvmCollectibleImagesStack(iconURL) : buildEvmTokenIconSources(chainId, address, iconURL),
    [address, chainId, iconURL, isCollectible]
  );

  return useImagesStack(sourcesStack);
};

export const useImagesStack = (sourcesStack: string[]) => {
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

  const src: string | undefined = sourcesStack[index];

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
