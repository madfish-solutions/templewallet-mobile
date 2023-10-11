import { OpKind, ParamsWithKind, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ObjktCurrencyInfo, ObjktListing } from 'src/apis/objkt/types';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import {
  FxHashBuyCollectibleContractInterface,
  ObjktBuyCollectibleContractInterface
} from 'src/interfaces/buy-collectible.interface';
import { isDefined } from 'src/utils/is-defined';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

const OBJKT_BUY_METHOD = 'fulfill_ask';
const DEFAULT_OBJKT_STORAGE_LIMIT = 350;
const TEZOS_ID_OBJKT = 1;

export const buildBuyCollectibleParams = async (
  tezos: TezosToolkit,
  accountPkh: string,
  listing: ObjktListing,
  currency: ObjktCurrencyInfo
) => {
  const marketplace = listing.marketplace_contract;

  const contract = await tezos.contract.at<
    ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface
  >(listing.marketplace_contract);

  const getTransferParams = () => {
    const isTezosCurrency = listing.currency_id === TEZOS_ID_OBJKT;
    const params = isTezosCurrency ? { amount: listing.price, mutez: true, source: accountPkh } : {};

    if (OBJKT_BUY_METHOD in contract?.methods) {
      return [contract.methods.fulfill_ask(listing.bigmap_key).toTransferParams(params)];
    } else {
      return [contract.methods.listing_accept(listing.bigmap_key, 1).toTransferParams(params)];
    }
  };

  const transferParams = getTransferParams();

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
