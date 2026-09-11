import { number as numberSchema, object as objectSchema, string as stringSchema } from 'yup';

import { evmAddressValidationSchema } from './utils';

export interface ValidatedWatchAssetParams {
  type: 'ERC20';
  options: {
    address: HexString;
    symbol?: string;
    decimals?: number;
    image?: string;
  };
}

/**
 * EIP-747 `wallet_watchAsset` body. Providers send a single object (not a JSON-RPC tuple).
 */
export const watchAssetParamsValidationSchema = () =>
  objectSchema({
    type: stringSchema().oneOf(['ERC20']).required(),
    options: objectSchema({
      address: evmAddressValidationSchema().required(),
      symbol: stringSchema().min(1).max(11),
      decimals: numberSchema().integer().min(0).max(255),
      image: stringSchema().min(1)
    }).required()
  }).required();
