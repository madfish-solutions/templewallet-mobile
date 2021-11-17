import { ContractAbstraction, ContractProvider } from '@taquito/taquito';

export interface ContractInterface<C extends ContractAbstraction<ContractProvider>, S> {
  contract: C | undefined;
  storage: S;
}
