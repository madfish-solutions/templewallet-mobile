import { BlockResponse } from '@taquito/rpc';
import { Subscription } from '@taquito/taquito';
import { useCallback } from 'react';

import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';

import { FallbackDemo, FallbackDemoProps } from './fallback-demo';

interface SubscriptionArtifacts {
  sub: Subscription<BlockResponse> | undefined;
  retryTimeoutId: NodeJS.Timeout | undefined;
}

export const TezosFallbackDemo = () => {
  const tezos = useReadOnlyTezosToolkit();

  const initialRpcUrl = useCallback(() => tezos.rpc.getRpcUrl(), [tezos]);

  const createSubscription = useCallback<FallbackDemoProps<SubscriptionArtifacts>['createSubscription']>(
    (setMessages, setUsedRpcUrl) => {
      let sub: Subscription<BlockResponse> | undefined;
      let retryTimeoutId: NodeJS.Timeout | undefined;

      const subscribe = () => {
        sub = tezos.stream.subscribeBlock('head');
        sub.on('data', block => {
          setMessages(prev => prev.concat(`Block received, level ${block.header.level}, hash ${block.hash}`));
          setUsedRpcUrl(tezos.rpc.getRpcUrl());
        });
        sub.on('error', error => {
          setMessages(prev => prev.concat(`Error: ${error.message}`));
          clearTimeout(retryTimeoutId);
          sub?.close();
          retryTimeoutId = setTimeout(() => subscribe(), 5000);
        });
      };

      subscribe();

      return { sub, retryTimeoutId };
    },
    [tezos]
  );

  const destroySubscription = useCallback<FallbackDemoProps<SubscriptionArtifacts>['destroySubscription']>(
    ({ sub, retryTimeoutId }) => {
      sub?.close();
      clearTimeout(retryTimeoutId);
    },
    []
  );

  return (
    <FallbackDemo
      networkName="Tezos"
      createSubscription={createSubscription}
      destroySubscription={destroySubscription}
      initialRpcUrl={initialRpcUrl}
    />
  );
};
