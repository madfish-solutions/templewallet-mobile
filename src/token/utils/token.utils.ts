import { WalletContract, TezosToolkit } from '@taquito/taquito';

import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import assert, { AssertionError } from '../../utils/assert.utils';

export const tokenMetadataSlug = <T extends { address: string; id?: number }>({ address, id }: T) => `${address}_${id}`;

function signatureAssertionFactory(name: string, args: string[]) {
  return (contract: WalletContract) => {
    const signatures = contract.parameterSchema.ExtractSignatures();
    const receivedSignature = signatures.find(signature => signature[0] === name);
    assert(receivedSignature);
    const receivedArgs = receivedSignature.slice(1);
    assert(receivedArgs.length === args.length);
    receivedArgs.forEach((receivedArg, index) => assert(receivedArg === args[index]));
  };
}

function viewSuccessAssertionFactory(name: string, args: any[]) {
  return async (contract: WalletContract, tezos: TezosToolkit) => {
    assert(contract.views[name]);
    await contract.views[name](...args).read((tezos as any).lambdaContract);
  };
}

const STUB_TEZOS_ADDRESS = 'tz1TTXUmQaxe1dTLPtyD4WMQP6aKYK9C8fKw';
const FA12_METHODS_ASSERTIONS = [
  {
    name: 'transfer',
    assertion: signatureAssertionFactory('transfer', ['address', 'address', 'nat'])
  },
  {
    name: 'approve',
    assertion: signatureAssertionFactory('approve', ['address', 'nat'])
  },
  {
    name: 'getAllowance',
    assertion: signatureAssertionFactory('getAllowance', ['address', 'address', 'contract'])
  },
  {
    name: 'getBalance',
    assertion: signatureAssertionFactory('getBalance', ['address', 'contract'])
  },
  {
    name: 'getTotalSupply',
    assertion: signatureAssertionFactory('getTotalSupply', ['unit', 'contract'])
  }
];

const FA2_METHODS_ASSERTIONS = [
  {
    name: 'update_operators',
    assertion: signatureAssertionFactory('update_operators', ['list'])
  },
  {
    name: 'transfer',
    assertion: signatureAssertionFactory('transfer', ['list'])
  },
  {
    name: 'balance_of',
    assertion: (contract: WalletContract, tezos: TezosToolkit, tokenId: number) =>
      viewSuccessAssertionFactory('balance_of', [[{ owner: STUB_TEZOS_ADDRESS, token_id: tokenId }]])(contract, tezos)
  }
];

export async function assertTokenType(
  tokenType: TokenTypeEnum.FA_1_2,
  contract: WalletContract,
  tezos: TezosToolkit
): Promise<void>;
export async function assertTokenType(
  tokenType: TokenTypeEnum.FA_2,
  contract: WalletContract,
  tezos: TezosToolkit,
  tokenId: number
): Promise<void>;
export async function assertTokenType(
  tokenType: TokenTypeEnum.FA_1_2 | TokenTypeEnum.FA_2,
  contract: WalletContract,
  tezos: TezosToolkit,
  tokenId?: number
) {
  const isFA12Token = tokenType === TokenTypeEnum.FA_1_2;
  const assertions = isFA12Token ? FA12_METHODS_ASSERTIONS : FA2_METHODS_ASSERTIONS;
  await Promise.all(
    assertions.map(async ({ name, assertion }) => {
      if (typeof contract.methods[name] !== 'function') {
        throw new NotMatchingStandardError(`'${name}' method isn't defined in contract`);
      }
      try {
        await assertion(contract, tezos, tokenId!);
      } catch (e) {
        if (e instanceof AssertionError) {
          throw new NotMatchingStandardError(`The signature of method '${name}' doesn't match standard`);
        } else if (e.value?.string === 'FA2_TOKEN_UNDEFINED') {
          throw new IncorrectTokenIdError('Incorrect token ID');
        } else {
          throw new Error(`An unknown error occurred while checking '${name}' entrypoint`);
        }
      }
    })
  );
}

export async function assertFA2TokenContract(contract: WalletContract) {
  const assertions = FA2_METHODS_ASSERTIONS.slice(0, 2) as {
    name: string;
    assertion: (contract: WalletContract) => void;
  }[];
  await Promise.all(
    assertions.map(async ({ name, assertion }) => {
      if (typeof contract.methods[name] !== 'function') {
        throw new NotMatchingStandardError(`'${name}' method isn't defined in contract`);
      }
      await assertion(contract);
    })
  );
}

export class NotMatchingStandardError extends Error {}
export class IncorrectTokenIdError extends Error {}
