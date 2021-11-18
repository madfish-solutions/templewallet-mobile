import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
export interface LiquidityBakingContractAbstraction extends ContractAbstraction<ContractProvider> {
  methods: {
    removeLiquidity: (
      senderPublicKeyHash: string,
      lpTokenInput: BigNumber,
      aTokenOutput: BigNumber,
      bTokenOutput: BigNumber,
      transactionTimeoutDate: string
    ) => ContractMethod<ContractProvider>;
    addLiquidity: (
      senderPublicKeyHash: string,
      lpTokensOutput: BigNumber,
      bTokenInput: BigNumber,
      transactionTimeoutDate: string
    ) => ContractMethod<ContractProvider>;
  };
}
