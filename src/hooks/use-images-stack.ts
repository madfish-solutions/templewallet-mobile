import { useCallback, useMemo, useState } from 'react';

import {
  buildTezosCollectibleImagesStack,
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

type ImagesStackStatus = 'failed' | 'loaded' | 'loading';

interface ImagesStackState {
  cacheKey?: string;
  index: number;
  sourcesStack: string[];
  status: ImagesStackStatus;
}

const SUCCESSFUL_SOURCES_CACHE_SIZE = 500;
const successfulSourcesCache = new Map<string, string>();

const cacheSuccessfulSource = (cacheKey: string, source: string) => {
  successfulSourcesCache.delete(cacheKey);
  successfulSourcesCache.set(cacheKey, source);

  if (successfulSourcesCache.size > SUCCESSFUL_SOURCES_CACHE_SIZE) {
    const oldestCacheKey = successfulSourcesCache.keys().next().value;

    if (oldestCacheKey != null) {
      successfulSourcesCache.delete(oldestCacheKey);
    }
  }
};

const buildImagesStackState = (sourcesStack: string[], cacheKey?: string): ImagesStackState => {
  if (sourcesStack.length < 1) {
    return { cacheKey, index: -1, sourcesStack, status: 'failed' };
  }

  const successfulSource = cacheKey == null ? undefined : successfulSourcesCache.get(cacheKey);
  const successfulSourceIndex = successfulSource == null ? -1 : sourcesStack.indexOf(successfulSource);

  return successfulSourceIndex < 0
    ? { cacheKey, index: 0, sourcesStack, status: 'loading' }
    : { cacheKey, index: successfulSourceIndex, sourcesStack, status: 'loaded' };
};

export const useTezosCollectibleImagesStack = (
  assetSlug: string,
  artifactUri?: string,
  displayUri?: string,
  thumbnailUri?: string,
  isFullView?: boolean
) => {
  const sourcesStack = useMemo(
    () => buildTezosCollectibleImagesStack(assetSlug, { artifactUri, displayUri, thumbnailUri }, isFullView),
    [assetSlug, artifactUri, displayUri, thumbnailUri, isFullView]
  );

  return useImagesStack(sourcesStack, `tezos-collectible:${assetSlug}`);
};

export const useEvmCollectibleImagesStack = (chainId: number, assetSlug: string, uri?: string) => {
  const sourcesStack = useMemo(() => buildEvmCollectibleImagesStack(uri), [uri]);

  return useImagesStack(sourcesStack, `evm-collectible:${chainId}:${assetSlug}`);
};

export const useTezosTokenImagesStack = ({ thumbnailUri = '' }: TezosTokenImagesStackParams) => {
  const sourcesStack = useMemo(() => buildTokenImagesStack(thumbnailUri), [thumbnailUri]);

  return useImagesStack(sourcesStack, `tezos:${thumbnailUri}`);
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

  const cacheKey = `evm:${chainId}:${address}:${iconURL ?? ''}:${isCollectible}`;

  return useImagesStack(sourcesStack, cacheKey);
};

export const useImagesStack = (sourcesStack: string[], cacheKey?: string) => {
  const [state, setState] = useState<ImagesStackState>(() => buildImagesStackState(sourcesStack, cacheKey));
  let currentState = state;

  // Reset before child commit so a cached image event cannot race with obsolete row state.
  if (state.sourcesStack !== sourcesStack || state.cacheKey !== cacheKey) {
    currentState = buildImagesStackState(sourcesStack, cacheKey);
    setState(currentState);
  }

  const src: string | undefined = sourcesStack[currentState.index];

  const onSuccess = useCallback(() => {
    if (src == null) {
      return;
    }

    if (cacheKey != null) {
      cacheSuccessfulSource(cacheKey, src);
    }

    setState(current =>
      current.sourcesStack === sourcesStack &&
      current.cacheKey === cacheKey &&
      current.sourcesStack[current.index] === src
        ? { ...current, status: 'loaded' }
        : current
    );
  }, [cacheKey, sourcesStack, src]);

  const onFail = useCallback(() => {
    setState(current => {
      if (
        current.sourcesStack !== sourcesStack ||
        current.cacheKey !== cacheKey ||
        current.status === 'failed' ||
        current.sourcesStack[current.index] !== src
      ) {
        return current;
      }

      const nextIndex = current.index + 1;

      return nextIndex === sourcesStack.length
        ? { cacheKey, index: -1, sourcesStack, status: 'failed' }
        : { cacheKey, index: nextIndex, sourcesStack, status: 'loading' };
    });
  }, [cacheKey, sourcesStack, src]);

  return {
    src,
    isLoading: currentState.status === 'loading',
    isStackFailed: currentState.status === 'failed',
    onSuccess,
    onFail
  };
};
