import { useEffect, useRef, useState } from 'react';

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
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);

  const [block, setBlock] = useState<BlockInterface>(EMPTY_BLOCK);

  useEffect(() => {
    let isActive = true;

    const setupWebSocket = () => {
      webSocketRef.current = new WebSocket(BLOCK_UPDATE_API_URL);
      // React Native emits `close` after `error` as well, so every dropped socket reconnects from here
      webSocketRef.current.onclose = () => {
        if (isActive) {
          timeoutIdRef.current = setTimeout(() => setupWebSocket(), 5000);
        }
      };
      webSocketRef.current.onmessage = event => {
        const block: BlockInterface = JSON.parse(event.data);
        setBlock(block);
      };
    };
    setupWebSocket();

    return () => {
      isActive = false;
      webSocketRef.current?.close();
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return { block };
};
