import { WalletContract } from '@taquito/taquito';

export interface TokenMethodsAssertionInterface {
  name: string;
  assertionFn: (contract: WalletContract) => void;
}
