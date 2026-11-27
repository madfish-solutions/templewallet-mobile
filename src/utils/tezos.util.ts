import { validateAddress, ValidationResult } from '@taquito/utils';

import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { TezosTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { TokenInterface } from '../token/interfaces/token.interface';

import { isDefined } from './is-defined';

export { atomsToTokens as mutezToTz, tokensToAtoms as tzToMutez } from './big-number.utils';

/** From @taquito/taquito */
export const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

export const RPC_RETRY_OPTIONS = {
  retries: 2,
  minTimeout: 100,
  maxTimeout: 100
};

export const isCollectible = <T extends TezosTokenMetadata>(asset: T) => isDefined(asset.artifactUri);

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isNonZeroBalance = (asset: Pick<TokenInterface, 'balance'>) => asset.balance !== '0';

export const isOwnedOrManual = (asset: Pick<AccountTokenInterface, 'balance' | 'manual'>) =>
  asset.manual === true || isNonZeroBalance(asset);

export const isKTAddress = (address: string) => address.startsWith('KT');
