import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface TzBtcTokenContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    approve: (address: string, amount: BigNumber) => ContractMethod<ContractProvider>;
  };
}
