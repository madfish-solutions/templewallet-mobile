import { of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { EstimateInterface } from '../interfaces/estimate.interface';
import { tezos$ } from './network/network.util';
import { ReadOnlySigner } from './read-only.signer.util';

export const estimate = async ({ params }: EstimateInterface, publicKey: string, pkh: string) => {
  const tezos = await of(new ReadOnlySigner(pkh, publicKey))
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
