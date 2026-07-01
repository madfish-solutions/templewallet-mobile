import { ContractType } from 'src/interfaces/contract.type';
import { isString } from 'src/utils/is-string';

import { TokenMethodsAssertionsMap } from '../data/token-methods-assertions';
import { TEZ_TOKEN_SLUG } from '../data/tokens-metadata';
import { TokenStandardsEnum } from '../interfaces/token-metadata.interface';

export const getTokenSlug = <T extends { address?: string; id?: number | string }>({ address, id }: T) =>
  toTokenSlug(address, id);

export const toTokenSlug = (address?: string | null, id?: number | string | null) =>
  isString(address) ? `${address}_${id ?? 0}` : TEZ_TOKEN_SLUG;

const assertTokenContractType = (contract: ContractType, tokenType: TokenStandardsEnum) => {
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
  assertTokenContractType(contract, TokenStandardsEnum.Fa12) ||
  assertTokenContractType(contract, TokenStandardsEnum.Fa2);

export const getTokenStandard = (tokenContract: ContractType) =>
  assertTokenContractType(tokenContract, TokenStandardsEnum.Fa2) ? TokenStandardsEnum.Fa2 : TokenStandardsEnum.Fa12;
