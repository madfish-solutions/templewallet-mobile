import { ContractType } from 'src/interfaces/contract.type';
import { isString } from 'src/utils/is-string';

import { TokenMethodsAssertionsMap } from '../data/token-methods-assertions';
import { TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from '../data/tokens-metadata';

interface TokenSlugInput {
  address?: string;
  id?: number | string;
}
import { TezosTokenStandardsEnum } from '../interfaces/token-metadata.interface';

export const getTokenSlug = <T extends TokenSlugInput>({ address, id }: T) => toTokenSlug(address, id);

export const isShieldedTez = <T extends TokenSlugInput>({ address, id }: T) =>
  getTokenSlug({ address, id }) === TEZ_SHIELDED_TOKEN_SLUG;

export const toTokenSlug = (address?: string | null, id?: number | string | null) =>
  isString(address) ? `${address}_${id ?? 0}` : TEZ_TOKEN_SLUG;

const assertTokenContractType = (contract: ContractType, tokenType: TezosTokenStandardsEnum) => {
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
  assertTokenContractType(contract, TezosTokenStandardsEnum.Fa12) ||
  assertTokenContractType(contract, TezosTokenStandardsEnum.Fa2);

export const getTokenStandard = (tokenContract: ContractType) =>
  assertTokenContractType(tokenContract, TezosTokenStandardsEnum.Fa2)
    ? TezosTokenStandardsEnum.Fa2
    : TezosTokenStandardsEnum.Fa12;
