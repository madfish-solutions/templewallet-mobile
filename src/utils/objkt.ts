import {
  ContractAbstraction,
  ContractMethodObject,
  ContractProvider,
  OpKind,
  ParamsWithKind,
  TezosToolkit
} from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ObjktCurrencyInfo, ObjktListing, ObjktOffer } from 'src/apis/objkt/types';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { isDefined } from 'src/utils/is-defined';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

export const SUPPORTED_CONTRACTS = [
  // OBJKT
  'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC',
  // FXHASH
  'KT1M1NyU9X4usEimt2f3kDaijZnDMNBu42Ja'
];

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;
const TEZOS_ID_OBJKT = 1;

export const buildBuyCollectibleParams = async (
  tezos: TezosToolkit,
  accountPkh: string,
  listing: ObjktListing,
  currency: ObjktCurrencyInfo
) => {
  const marketplace = listing.marketplace_contract;

  const contract = await getObjktMarketplaceBuyingContract(tezos, listing.marketplace_contract).catch(error => {
    console.error(error);
    throw error;
  });

  const isTezosCurrency = listing.currency_id === TEZOS_ID_OBJKT;
  const params = isTezosCurrency ? { amount: listing.price, mutez: true, source: accountPkh } : {};

  const methodCallResult =
    'fulfill_ask' in contract.methodsObject
      ? contract.methodsObject.fulfill_ask({ ask_id: listing.bigmap_key })
      : contract.methodsObject.listing_accept({ listing_id: listing.bigmap_key, amount: 1 });

  const transferParams = [methodCallResult.toTransferParams(params)];

  const isTokenFa2 = listing.currency.type === 'fa2';

  const tokenToSpend = {
    symbol: currency.symbol,
    standard: isTokenFa2 ? Route3TokenStandardEnum.fa2 : Route3TokenStandardEnum.fa12,
    contract: currency.contract,
    tokenId: `${currency.id}`,
    decimals: currency.decimals
  };

  const { approve, revoke } = await getTransferPermissions(
    tezos,
    marketplace,
    accountPkh,
    tokenToSpend,
    new BigNumber(listing.price)
  );

  transferParams.unshift(...approve);
  transferParams.push(...revoke);

  const updatedTransferParams = transferParams
    .filter(params => isDefined(params))
    .map(item => ({ ...item, kind: OpKind.TRANSACTION, storageLimit: DEFAULT_OBJKT_STORAGE_LIMIT }));

  return updatedTransferParams as ParamsWithKind[];
};

export const buildSellCollectibleParams = async (
  tezos: TezosToolkit,
  accountPkh: string,
  collectionContract: string,
  tokenId: string,
  objktOffer: ObjktOffer,
  currency: ObjktCurrencyInfo
) => {
  const contract = await getObjktMarketplaceListingContract(tezos, objktOffer.marketplace_contract).catch(error => {
    console.error(error);
    throw error;
  });

  const methodCallResult =
    'fulfill_offer' in contract.methodsObject
      ? contract.methodsObject.fulfill_offer({ offer_id: objktOffer.bigmap_key, token_id: Number(tokenId) })
      : contract.methodsObject.offer_accept({ offer_id: objktOffer.bigmap_key });

  const transferParams = [methodCallResult.toTransferParams()];

  const token = {
    id: tokenId,
    symbol: currency.symbol,
    standard: Route3TokenStandardEnum.fa2,
    contract: collectionContract,
    tokenId: tokenId,
    decimals: currency.decimals
  };

  const { approve, revoke } = await getTransferPermissions(
    tezos,
    objktOffer.marketplace_contract,
    accountPkh,
    token,
    new BigNumber('0')
  );

  transferParams.unshift(...approve);
  transferParams.push(...revoke);

  const updatedTransferParams = transferParams
    .filter(params => isDefined(params))
    .map(item => ({ ...item, kind: OpKind.TRANSACTION, storageLimit: DEFAULT_OBJKT_STORAGE_LIMIT }));

  return updatedTransferParams as ParamsWithKind[];
};

const getObjktMarketplaceListingContract = (tezos: TezosToolkit, address: string) =>
  tezos.contract.at<ObjktListingContractInterface | FxHashListingContractInterface>(address);

interface ObjktListingContractInterface extends ContractAbstraction<ContractProvider> {
  methodsObject: {
    fulfill_offer: (params: { offer_id: number; token_id: number }) => ContractMethodObject<ContractProvider>;
  };
}

interface FxHashListingContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    offer_accept: (params: { offer_id: number }) => ContractMethodObject<ContractProvider>;
  };
}

const getObjktMarketplaceBuyingContract = (tezos: TezosToolkit, address: string) =>
  tezos.contract.at<ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface>(address);

interface ObjktBuyCollectibleContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    fulfill_ask: (params: { ask_id: number; proxy?: string }) => ContractMethodObject<ContractProvider>;
  };
}

interface FxHashBuyCollectibleContractInterface extends ContractAbstraction<ContractProvider> {
  methods: {
    listing_accept: (params: { listing_id: number; amount: number }) => ContractMethodObject<ContractProvider>;
  };
}
