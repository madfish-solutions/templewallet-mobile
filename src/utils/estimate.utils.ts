import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { useEffect, useState } from 'react';
import { of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { EstimateInterface } from '../interfaces/estimate.interface';
import { useHdAccountsListSelector } from '../store/wallet/wallet-selectors';
import { tezos$ } from './network/network.util';
import { ReadOnlySigner } from './read-only.signer.util';

const estimate = async ({ params }: EstimateInterface, publicKey: string, publicKeyHash: string) => {
  const tezos = await of(new ReadOnlySigner(publicKeyHash, publicKey))
    .pipe(
      withLatestFrom(tezos$),
      map(([signer, toolkit]) => {
        toolkit.setSignerProvider(signer);

        return toolkit;
      })
    )
    .toPromise();

  if (params instanceof Array) {
    return tezos.estimate.batch(params);
  }

  switch (params.kind) {
    case 'origination':
      return [await tezos.estimate.originate(params)];
    case 'delegation':
      return [await tezos.estimate.setDelegate(params)];
    case 'transaction':
      return [await tezos.estimate.transfer(params)];
    default:
      throw new Error('Params of this kind are not supported yet');
  }
};

export const useEstimations = ({ from, params }: EstimateInterface) => {
  const accounts = useHdAccountsListSelector();
  const [estimations, setEstimations] = useState<Estimate[]>();
  const [estimationError, setEstimationError] = useState<Error>();

  useEffect(() => {
    (async () => {
      const publicKey = accounts.find(({ publicKeyHash }) => publicKeyHash === from)?.publicKey;
      try {
        if (!publicKey) {
          throw new Error('Failed to get public key of the source account');
        }
        const estimations = await estimate(
          {
            from,
            params: params instanceof Array && params.length === 1 ? params[0] : params
          },
          publicKey,
          from
        );
        setEstimations(estimations);
      } catch (e) {
        setEstimationError(e);
      }
    })();
  }, [accounts, from, params]);

  return {
    estimations,
    estimationError
  };
};
