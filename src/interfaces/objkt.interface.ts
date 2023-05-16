import { ContractAbstraction, ContractProvider, ContractMethod } from '@taquito/taquito';

export interface ObjktContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    fulfill_offer: (offer_id: number, token_id: number) => ContractMethod<ContractProvider>;
  };
}
