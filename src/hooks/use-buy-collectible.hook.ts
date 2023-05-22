import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  FxHashBuyCollectibleContractInterface,
  ObjktBuyCollectibleContractInterface
} from '../interfaces/buy-collectible.interface';
import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { Route3Token } from '../interfaces/route3.interface';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { navigateAction } from '../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { createTezosToolkit } from '../utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from '../utils/swap-permissions.util';

const OBJKT_BUY_METHOD = 'fulfill_ask';
const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

export const useBuyCollectible = (marketplace: string) => {
  const selectedRpc = useSelectedRpcUrlSelector();
  const tezos = createTezosToolkit(selectedRpc);

  const selectedAccount = useSelectedAccountSelector();

  const dispatch = useDispatch();

  const [marketplaceContract, setMarketplaceContract] = useState<
    ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface
  >();

  useEffect(() => {
    tezos.contract
      .at<ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface>(marketplace)
      .then(setMarketplaceContract);
  }, []);

  const handleBuyCollectible = async (bigmapKey: number, tokenToSpend: Route3Token, price: number) => {
    const transferParams = isDefined(marketplaceContract)
      ? OBJKT_BUY_METHOD in marketplaceContract?.methods
        ? [marketplaceContract.methods.fulfill_ask(bigmapKey).toTransferParams()]
        : [marketplaceContract.methods.listing_accept(1, bigmapKey).toTransferParams()]
      : [];

    const { approve, revoke } = await getTransferPermissions(
      tezos,
      marketplace,
      selectedAccount.publicKeyHash,
      tokenToSpend,
      new BigNumber(price)
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

  return { handleBuyCollectible };
};
