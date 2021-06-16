import { ContractAbstraction, ContractProvider, WalletContract } from '@taquito/taquito';

export type ContractType = WalletContract | ContractAbstraction<ContractProvider>;
