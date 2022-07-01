import { ContractType } from '../../interfaces/contract.type';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { assert } from '../../utils/assert.utils';
import { TokenMethodsAssertionInterface } from '../interfaces/token-methods-assertion.interface';

const signatureAssertionFactory = (name: string, args: string[]) => (contract: ContractType) => {
  const signatures = contract.parameterSchema.ExtractSignatures();
  const receivedSignature = signatures.find(signature => signature[0] === name);

  assert(receivedSignature);
  const receivedArgs = receivedSignature.slice(1);

  assert(receivedArgs.length === args.length);
  receivedArgs.forEach((receivedArg, index) => assert(receivedArg === args[index]));
};

const FA_1_2_TOKEN_METHODS_ASSERTIONS: TokenMethodsAssertionInterface[] = [
  {
    name: 'transfer',
    assertionFn: signatureAssertionFactory('transfer', ['address', 'pair'])
  },
  {
    name: 'approve',
    assertionFn: signatureAssertionFactory('approve', ['address', 'nat'])
  },
  {
    name: 'getAllowance',
    assertionFn: signatureAssertionFactory('getAllowance', ['address', 'address', 'contract'])
  },
  {
    name: 'getBalance',
    assertionFn: signatureAssertionFactory('getBalance', ['address', 'contract'])
  },
  {
    name: 'getTotalSupply',
    assertionFn: signatureAssertionFactory('getTotalSupply', ['unit', 'contract'])
  }
];

const FA_2_TOKEN_METHODS_ASSERTIONS: TokenMethodsAssertionInterface[] = [
  {
    name: 'update_operators',
    assertionFn: signatureAssertionFactory('update_operators', ['list'])
  },
  {
    name: 'transfer',
    assertionFn: signatureAssertionFactory('transfer', ['list'])
  },
  {
    name: 'balance_of',
    assertionFn: signatureAssertionFactory('balance_of', ['list'])
  }
];

export const TokenMethodsAssertionsMap: Record<TokenTypeEnum, TokenMethodsAssertionInterface[]> = {
  [TokenTypeEnum.FA_1_2]: FA_1_2_TOKEN_METHODS_ASSERTIONS,
  [TokenTypeEnum.FA_2]: FA_2_TOKEN_METHODS_ASSERTIONS
};
