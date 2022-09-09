import { BlockResponse, BlockFullHeader } from '@taquito/rpc';
import { useEffect, useRef, useState } from 'react';

export interface ResponseInterface {
  block: BlockInterface;
}

export interface BlockInterface extends Pick<BlockResponse, 'protocol' | 'chain_id' | 'hash'> {
  header: Pick<BlockFullHeader, 'level' | 'timestamp'>;
}

export const EMPTY_BLOCK: BlockInterface = {
  protocol: '',
  chain_id: '',
  hash: '',
  header: {
    level: 0,
    timestamp: ''
  }
};

export const useBlockSubscription = (webSocketUrl: string) => {
  const webSocketRef = useRef<WebSocket>();
  const refreshControlRef = useRef(Math.random());

  const [block, setBlock] = useState<BlockInterface>(EMPTY_BLOCK);
  const [hasFailed, setHasFailed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    refreshControlRef.current = Math.random();
  };

  useEffect(() => {
    webSocketRef.current = new WebSocket(webSocketUrl);

    webSocketRef.current.onerror = (errorEvent: Event) => {
      console.log(errorEvent);
      setHasFailed(true);
      setIsRefreshing(false);
    };

    webSocketRef.current.onmessage = event => {
      setHasFailed(false);
      setIsRefreshing(false);
      const rawResponse: ResponseInterface = JSON.parse(event.data);

      setBlock(rawResponse.block);
    };

    return () => webSocketRef.current?.close();
  }, [webSocketUrl, refreshControlRef.current]);

  return { block, hasFailed, isRefreshing, onRefresh };
};
