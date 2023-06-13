import { ContractProvider, ContractMethod, ContractAbstraction } from '@taquito/taquito';

export interface ObjktBuyCollectibleContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    fulfill_ask: (ask_id: number) => ContractMethod<ContractProvider>;
  };
}

export interface FxHashBuyCollectibleContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    listing_accept: (listing_id: number, amount: number) => ContractMethod<ContractProvider>;
  };
}
