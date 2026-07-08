import { ContractType } from 'src/interfaces/contract.type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { isString } from 'src/utils/is-string';

import { TokenMethodsAssertionsMap } from '../data/token-methods-assertions';
import { TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from '../data/tokens-metadata';

interface TokenSlugInput {
  address?: string;
  id?: number | string;
}

export const getTokenSlug = <T extends TokenSlugInput>({ address, id }: T) => toTokenSlug(address, id);

export const isShieldedTez = <T extends TokenSlugInput>({ address, id }: T) =>
  getTokenSlug({ address, id }) === TEZ_SHIELDED_TOKEN_SLUG;

export const toTokenSlug = (address?: string | null, id?: number | string | null) =>
  isString(address) ? `${address}_${id ?? 0}` : TEZ_TOKEN_SLUG;

const assertTokenContractType = (contract: ContractType, tokenType: TokenTypeEnum) => {
  try {
    for (const assertion of TokenMethodsAssertionsMap[tokenType]) {
      const { name, assertionFn } = assertion;

      if (typeof contract.methodsObject[name] !== 'function') {
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
