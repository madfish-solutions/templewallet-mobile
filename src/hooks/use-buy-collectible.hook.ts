import { isNonEmptyArray } from '@apollo/client/utilities';
import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import {
  FxHashBuyCollectibleContractInterface,
  ObjktBuyCollectibleContractInterface
} from 'src/interfaces/buy-collectible.interface';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { OBJKT_MARKETPLACE_CONTRACT } from 'src/modals/collectible-modal/constants';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { CollectibleCommonInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { getPurchaseCurrency } from 'src/utils/get-pusrchase-currency.util';
import { isDefined } from 'src/utils/is-defined';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { useCollectibleOwnerCheck } from './use-check-is-user-collectible-owner.hook';

const OBJKT_BUY_METHOD = 'fulfill_ask';
const DEFAULT_OBJKT_STORAGE_LIMIT = 350;
const TEZOS_ID_OBJKT = 1;

export const useBuyCollectible = (slug: string, details: CollectibleCommonInterface) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedRpc = useSelectedRpcUrlSelector();
  const tezos = createTezosToolkit(selectedRpc);

  const allMetadatas = useTokensMetadataSelector();
  const metadata = allMetadatas[slug];

  const accountPkh = useCurrentAccountPkhSelector();

  const listingsActive = details.listingsActive;

  const isUserOwnerCurrentCollectible = useCollectibleOwnerCheck(slug);

  const marketplace = isNonEmptyArray(listingsActive)
    ? listingsActive[0].marketplace_contract
    : OBJKT_MARKETPLACE_CONTRACT;

  const [marketplaceContract, setMarketplaceContract] = useState<
    ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface
  >();

  useEffect(() => {
    tezos.contract
      .at<ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface>(marketplace)
      .then(setMarketplaceContract);
  }, [marketplace, tezos.contract]);

  const purchaseCurrency = getPurchaseCurrency(listingsActive);

  const buyCollectible = async () => {
    if (isUserOwnerCurrentCollectible) {
      if (metadata) {
        return navigate(ModalsEnum.Send, { token: metadata });
      }
    }

    const getTransferParams = () => {
      if (isDefined(marketplaceContract) && isNonEmptyArray(listingsActive)) {
        const isTezosCurrency = listingsActive[0].currency_id === TEZOS_ID_OBJKT;
        const params = isTezosCurrency ? { amount: purchaseCurrency.price, mutez: true, source: accountPkh } : {};

        if (OBJKT_BUY_METHOD in marketplaceContract?.methods) {
          return [marketplaceContract.methods.fulfill_ask(listingsActive[0].bigmap_key).toTransferParams(params)];
        } else {
          return [marketplaceContract.methods.listing_accept(listingsActive[0].bigmap_key, 1).toTransferParams(params)];
        }
      }

      return [];
    };

    const transferParams = getTransferParams();

    const isTokenFa2 = isNonEmptyArray(listingsActive)
      ? listingsActive[0].currency.type === Route3TokenStandardEnum.fa2
      : true;

    const tokenToSpend = {
      id: Number(purchaseCurrency.id ?? 0),
      symbol: purchaseCurrency.symbol,
      standard: isTokenFa2 ? Route3TokenStandardEnum.fa2 : Route3TokenStandardEnum.fa12,
      contract: purchaseCurrency.contract,
      tokenId: `${purchaseCurrency.id}`,
      decimals: purchaseCurrency.decimals
    };

    const { approve, revoke } = await getTransferPermissions(
      tezos,
      marketplace,
      accountPkh,
      tokenToSpend,
      new BigNumber(purchaseCurrency.price)
    );

    transferParams.unshift(...approve);
    transferParams.push(...revoke);

    const updatedTransferParams = transferParams
      .filter(params => isDefined(params))
      .map(item => ({ ...item, kind: OpKind.TRANSACTION, storageLimit: DEFAULT_OBJKT_STORAGE_LIMIT }));

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams: updatedTransferParams as ParamsWithKind[]
      })
    );
  };

  return { buyCollectible, purchaseCurrency };
};
