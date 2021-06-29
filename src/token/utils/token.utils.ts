import { ContractType } from '../../interfaces/contract.type';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { TokenMethodsAssertionsMap } from '../data/token-methods-assertions';

export const tokenMetadataSlug = <T extends { address: string; id?: number }>({ address, id }: T) => `${address}_${id}`;

// TODO: validate added token address & id on Add Token Modal
export const validateToken = (tokenType: TokenTypeEnum) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const assertions = TokenMethodsAssertionsMap[tokenType];
};

export const getTokenType = (contract: ContractType) => {
  const assertions = TokenMethodsAssertionsMap[TokenTypeEnum.FA_2];

  try {
    for (const assertion of assertions) {
      const { name, assertionFn } = assertion;

      if (typeof contract.methods[name] !== 'function') {
        throw new Error(`'${name}' method isn't defined in contract`);
      }
      assertionFn(contract);
    }

    return TokenTypeEnum.FA_2;
  } catch {
    return TokenTypeEnum.FA_1_2;
  }
};
