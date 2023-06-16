import { isNonEmptyArray } from '@apollo/client/utilities';
import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { currencyInfoById } from '../apis/objkt/constants';
import { Route3TokenStandardEnum } from '../enums/route3.enum';
import {
  FxHashBuyCollectibleContractInterface,
  ObjktBuyCollectibleContractInterface
} from '../interfaces/buy-collectible.interface';
import { CollectibleInfo } from '../interfaces/collectible-info.interface';
import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { OBJKT_MARKETPLACE_CONTRACT } from '../modals/collectible-modal/constants';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { navigateAction } from '../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { TokenInterface } from '../token/interfaces/token.interface';
import { isDefined } from '../utils/is-defined';
import { createTezosToolkit } from '../utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from '../utils/swap-permissions.util';
import { useCollectibleOwnerCheck } from './use-check-is-user-collectible-owner.hook';

const OBJKT_BUY_METHOD = 'fulfill_ask';
const DEFAULT_OBJKT_STORAGE_LIMIT = 350;
const TEZOS_ID_OBJKT = 1;

export const useBuyCollectible = (collectibleInfo: CollectibleInfo, collectible: TokenInterface) => {
  const { listings_active } = collectibleInfo;

  const selectedRpc = useSelectedRpcUrlSelector();
  const tezos = createTezosToolkit(selectedRpc);

  const selectedAccount = useSelectedAccountSelector();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const isUserOwnerCurrentCollectible = useCollectibleOwnerCheck(collectible);

  const marketplace = isNonEmptyArray(listings_active)
    ? listings_active[0].marketplace_contract
    : OBJKT_MARKETPLACE_CONTRACT;

  const [marketplaceContract, setMarketplaceContract] = useState<
    ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface
  >();

  useEffect(() => {
    tezos.contract
      .at<ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface>(marketplace)
      .then(setMarketplaceContract);
  }, [marketplace]);

  const purchaseCurrency = useMemo(() => {
    if (!isNonEmptyArray(listings_active)) {
      return {
        price: 0,
        contract: null,
        decimals: 0,
        id: null,
        symbol: ''
      };
    }

    const { price, currency_id } = listings_active[0];
    const currentCurrency = currencyInfoById[currency_id];

    return { price, ...currentCurrency };
  }, [collectibleInfo]);

  const handleSubmit = async () => {
    if (isUserOwnerCurrentCollectible) {
      return navigate(ModalsEnum.Send, { token: collectible });
    }

    const getTransferParams = () => {
      if (isDefined(marketplaceContract) && isNonEmptyArray(listings_active)) {
        const isTezosCurrency = listings_active[0].currency_id === TEZOS_ID_OBJKT;
        const params = isTezosCurrency
          ? { amount: purchaseCurrency.price, mutez: true, source: selectedAccount.publicKeyHash }
          : {};

        if (OBJKT_BUY_METHOD in marketplaceContract?.methods) {
          return [marketplaceContract.methods.fulfill_ask(listings_active[0].bigmap_key).toTransferParams(params)];
        } else {
          return [
            marketplaceContract.methods.listing_accept(listings_active[0].bigmap_key, 1).toTransferParams(params)
          ];
        }
      }

      return [];
    };

    const transferParams = getTransferParams();

    const isTokenFa2 = listings_active[0].currency.type === Route3TokenStandardEnum.fa2;

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
      selectedAccount.publicKeyHash,
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

  return { handleSubmit, purchaseCurrency };
};
