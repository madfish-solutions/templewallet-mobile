import { ContractType } from '../../interfaces/contract.type';

export interface TokenMethodsAssertionInterface {
  name: string;
  assertionFn: (contract: ContractType) => void;
}
