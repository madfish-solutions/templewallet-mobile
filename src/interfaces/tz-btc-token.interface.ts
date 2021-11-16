import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface TzBtcTokenContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    approve: (receiverAddress: string, amount: BigNumber) => ContractMethod<ContractProvider>;
  };
}
