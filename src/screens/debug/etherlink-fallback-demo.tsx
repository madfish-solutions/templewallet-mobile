import { useCallback } from 'react';
import { WatchBlocksReturnType } from 'viem';

import { useEtherlinkPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';

import { FallbackDemo, FallbackDemoProps } from './fallback-demo';

interface SubscriptionArtifacts {
  unwatch: WatchBlocksReturnType | undefined;
  retryTimeoutId: NodeJS.Timeout | undefined;
}

export const EtherlinkFallbackDemo = () => {
  const client = useEtherlinkPublicClient();

  const createSubscription = useCallback<FallbackDemoProps<SubscriptionArtifacts>['createSubscription']>(
    (setMessages, _setUsedRpcUrl) => {
      let unwatch: WatchBlocksReturnType | undefined;
      let retryTimeoutId: NodeJS.Timeout | undefined;

      const subscribe = () => {
        unwatch = client.watchBlocks({
          onBlock: block => {
            setMessages(prev => prev.concat(`Block received, level ${block.number.toString()}, hash ${block.hash}`));
          },
          onError: error => {
            setMessages(prev => prev.concat(`Error: ${error.message}`));
            clearTimeout(retryTimeoutId);
            unwatch?.();
            retryTimeoutId = setTimeout(() => subscribe(), 5000);
          }
        });
      };

      subscribe();

      return { unwatch, retryTimeoutId };
    },
    [client]
  );

  const destroySubscription = useCallback<FallbackDemoProps<SubscriptionArtifacts>['destroySubscription']>(
    ({ unwatch, retryTimeoutId }) => {
      unwatch?.();
      clearTimeout(retryTimeoutId);
    },
    []
  );

  return (
    <FallbackDemo
      networkName="Etherlink"
      createSubscription={createSubscription}
      destroySubscription={destroySubscription}
      initialRpcUrl="Unavailable"
    />
  );
};
