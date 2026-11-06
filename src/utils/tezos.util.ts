import { validateAddress, ValidationResult } from '@taquito/utils';
import { BigNumber } from 'bignumber.js';

import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { TezosTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { TokenInterface } from '../token/interfaces/token.interface';

import { safeShiftedBy } from './big-number.utils';
import { isDefined } from './is-defined';

/** From @taquito/taquito */
export const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

export const RPC_RETRY_OPTIONS = {
  retries: 2,
  minTimeout: 100,
  maxTimeout: 100
};

export const mutezToTz = (x: BigNumber, decimals: number | nullish) => {
  if (!x.isFinite() || typeof decimals !== 'number' || !Number.isInteger(decimals)) {
    return x;
  }

  return safeShiftedBy(new BigNumber(x).integerValue(), -decimals);
};

export const tzToMutez = (x: BigNumber, decimals: number | nullish) => {
  if (!x.isFinite() || typeof decimals !== 'number' || !Number.isInteger(decimals)) {
    return x;
  }

  return safeShiftedBy(new BigNumber(x), decimals).integerValue();
};

export const isCollectible = <T extends TezosTokenMetadata>(asset: T) => isDefined(asset.artifactUri);

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isNonZeroBalance = (asset: Pick<TokenInterface, 'balance'>) => asset.balance !== '0';

export const isOwnedOrManual = (asset: Pick<AccountTokenInterface, 'balance' | 'manual'>) =>
  asset.manual === true || isNonZeroBalance(asset);

export const isKTAddress = (address: string) => address.startsWith('KT');
