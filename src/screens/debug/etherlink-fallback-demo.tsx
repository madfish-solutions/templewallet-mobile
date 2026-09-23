import { useCallback } from 'react';
import { WatchBlocksReturnType } from 'viem';

import { useViemPublicClient } from 'src/hooks/evm/use-viem-public-client.hook';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list.ts';

import { FallbackDemo, FallbackDemoProps } from './fallback-demo';

interface SubscriptionArtifacts {
  unwatch: WatchBlocksReturnType | undefined;
  retryTimeoutId: NodeJS.Timeout | undefined;
}

export const EtherlinkFallbackDemo = () => {
  const client = useViemPublicClient(ETHERLINK_MAINNET_CHAIN_ID);

  const createSubscription = useCallback<FallbackDemoProps<SubscriptionArtifacts>['createSubscription']>(
    (setMessages, _setUsedRpcUrl) => {
      let unwatch: WatchBlocksReturnType | undefined;
      let retryTimeoutId: NodeJS.Timeout | undefined;

      const subscribe = () => {
        unwatch = client?.watchBlocks({
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
