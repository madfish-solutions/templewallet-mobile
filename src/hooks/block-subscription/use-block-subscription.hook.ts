import { useCallback, useEffect, useRef, useState } from 'react';

import { TEZOS_DEXES_API_URL } from 'src/utils/env.utils';

import { BlockInterface, EMPTY_BLOCK } from './block.interface';

const BLOCK_UPDATE_API_URL = `${TEZOS_DEXES_API_URL}/block`;

/**
 * Currently, some updates might be lost.
 *
 * TODO: Look into:
 * ```
 * useEffect(() => {
 *   const subscription = tezos.stream.subscribeBlock('head');
 *
 *   subscription.on('data', block => setBlockLevel(block.header.level));
 *
 *   return () => subscription.close();
 * }, [tezos]);
 * ```
 */
export const useBlockSubscription = () => {
  const webSocketRef = useRef<WebSocket>(undefined);
  const refreshControlRef = useRef(Math.random());
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);

  const [block, setBlock] = useState<BlockInterface>(EMPTY_BLOCK);
  const [hasFailed, setHasFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshControlRef.current = Math.random();
  }, []);

  useEffect(() => {
    const setupWebSocket = () => {
      webSocketRef.current = new WebSocket(BLOCK_UPDATE_API_URL);
      webSocketRef.current.onerror = () => {
        setHasFailed(true);
        setIsRefreshing(false);
        timeoutIdRef.current = setTimeout(() => setupWebSocket(), 5000);
      };
      webSocketRef.current.onmessage = event => {
        setHasFailed(false);
        setIsRefreshing(false);
        const block: BlockInterface = JSON.parse(event.data);
        setBlock(block);
      };
    };
    setupWebSocket();

    return () => {
      webSocketRef.current?.close();
      clearTimeout(timeoutIdRef.current);
    };
  }, [refreshControlRef.current]);

  return { block, hasFailed, isRefreshing, onRefresh };
};
