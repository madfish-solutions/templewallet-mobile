import { ContractType } from 'src/interfaces/contract.type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { isString } from 'src/utils/is-string';

import { TokenMethodsAssertionsMap } from '../data/token-methods-assertions';
import { TEZ_TOKEN_SLUG } from '../data/tokens-metadata';
import { TokenInterface } from '../interfaces/token.interface';

export const getTokenSlug = <T extends { address?: string; id?: number | string }>({ address, id }: T) =>
  toTokenSlug(address, id);

export const toTokenSlug = (address?: string | null, id?: number | string | null) =>
  isString(address) ? `${address}_${id ?? 0}` : TEZ_TOKEN_SLUG;

const assertTokenContractType = (contract: ContractType, tokenType: TokenTypeEnum) => {
  try {
    for (const assertion of TokenMethodsAssertionsMap[tokenType]) {
      const { name, assertionFn } = assertion;

      if (typeof contract.methods[name] !== 'function') {
        throw new Error(`'${name}' method isn't defined in contract`);
      }

      assertionFn(contract);
    }

    return true;
  } catch {
    return false;
  }
};

export const isValidTokenContract = (contract: ContractType) =>
  assertTokenContractType(contract, TokenTypeEnum.FA_1_2) || assertTokenContractType(contract, TokenTypeEnum.FA_2);

export const getTokenType = (tokenContract: ContractType) =>
  assertTokenContractType(tokenContract, TokenTypeEnum.FA_2) ? TokenTypeEnum.FA_2 : TokenTypeEnum.FA_1_2;

export const getUniqueTokens = (accumulator: Array<TokenInterface>, current: TokenInterface) => {
  const currentTokenSlug = toTokenSlug(current.address, current.id);

  if (!Boolean(accumulator.find(asset => toTokenSlug(asset.address, asset.id) === currentTokenSlug))) {
    accumulator.push(current);
  }

  return accumulator;
};
