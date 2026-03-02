import { HttpResponseError } from '@taquito/http-utils';
import { MichelsonV1Expression, TezosGenericOperationError } from '@taquito/rpc';
import { TezosOperationError } from '@taquito/taquito';
import { isObject } from 'lodash-es';

import { isKTAddress } from './tezos.util';

interface TezosGenericOperationErrorWithExtraFields extends TezosGenericOperationError {
  contract?: string;
  with?: MichelsonV1Expression;
  contract_handle?: string;
}

export const isTooLowTezBalanceError = (error: unknown): boolean => {
  if (error instanceof TezosOperationError) {
    const balanceTooLowError: TezosGenericOperationErrorWithExtraFields | undefined = error.errors.find(err =>
      err.id.includes('balance_too_low')
    );

    if (!balanceTooLowError) {
      return false;
    }

    const { contract } = balanceTooLowError;

    return !contract || !isKTAddress(contract);
  }

  if (error instanceof HttpResponseError) {
    try {
      const body = JSON.parse(error.body);
      if (
        Array.isArray(body) &&
        body.length > 0 &&
        body.every(
          item =>
            isObject(item) &&
            'kind' in item &&
            'id' in item &&
            typeof item.kind === 'string' &&
            typeof item.id === 'string'
        )
      ) {
        return isTooLowTezBalanceError(new TezosOperationError(body, '', []));
      }
    } catch {}
  }

  return false;
};
