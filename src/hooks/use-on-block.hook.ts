import { Subscription } from '@taquito/taquito';
import { useEffect, useRef, useState } from 'react';

import { tezos$ } from '../utils/network/network.util';

export function useOnBlock(callback: (blockHash: string) => void) {
  const blockHashRef = useRef<string>();
  const [tezos, setTezos] = useState(tezos$.getValue());

  useEffect(() => {
    const subscription = tezos$.subscribe(newToolkit => setTezos(newToolkit));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let sub: Subscription<string>;

    function spawnSub() {
      sub = tezos.stream.subscribe('head');

      sub.on('data', hash => {
        console.log('x1', hash);
        if (blockHashRef.current && blockHashRef.current !== hash) {
          callback(hash);
        }
        blockHashRef.current = hash;
      });
      sub.on('error', err => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
        sub.close();
        spawnSub();
      });
    }
    spawnSub();

    return () => {
      console.log('destroy');
      sub.close();
    };
  }, [tezos, callback]);
}
