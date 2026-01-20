import { TokenSchema } from '@taquito/michelson-encoder';
import { isEqual } from 'lodash-es';

import { ContractType } from 'src/interfaces/contract.type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { assert } from 'src/utils/assert.utils';

import { TokenMethodsAssertionInterface } from '../interfaces/token-methods-assertion.interface';

const extractArgsTypes = (schema: TokenSchema): string[] => {
  if (schema.__michelsonType === 'pair') {
    return Object.values(schema.schema).flatMap(extractArgsTypes);
  }

  return [schema.__michelsonType];
};

const signatureAssertionFactory = (name: string, args: string[]) => (contract: ContractType) => {
  const schema = contract.parameterSchema.generateSchema();
  const receivedSchema = schema.__michelsonType === 'or' ? schema.schema[name] : undefined;

  assert(receivedSchema);
  assert(isEqual(extractArgsTypes(receivedSchema), args));
};

const FA_1_2_TOKEN_METHODS_ASSERTIONS: TokenMethodsAssertionInterface[] = [
  // TODO: investigate why different FA 1.2 tokens have different transfer schema
  // {
  //   name: 'transfer',
  //   assertionFn: signatureAssertionFactory('transfer', ['address', 'pair'])
  // },
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
