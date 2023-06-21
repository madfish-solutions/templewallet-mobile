import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { OBJKT_CONTRACT } from 'src/apis/objkt/constants';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { FxHashContractInterface, ObjktContractInterface } from 'src/interfaces/marketplaces.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';

interface Props {
  isOffersExisted: boolean;
  isHolder: boolean;
  highestOffer: string;
  item: TokenInterface;
  selectedPublicKeyHash: string;
  selectedRpc: string;
  collectionContract: string;
}

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

export const OfferButton: FC<Props> = memo(
  ({ isOffersExisted, isHolder, highestOffer, item, selectedPublicKeyHash, selectedRpc, collectionContract }) => {
    const styles = useCollectibleItemStyles();

    const [offer, setOffer] = useState<ObjktContractInterface | FxHashContractInterface>();
    const dispatch = useDispatch();

    const tezos = useMemo(() => createTezosToolkit(selectedRpc), [selectedRpc]);

    useEffect(() => {
      tezos.contract
        .at<ObjktContractInterface | FxHashContractInterface>(item.highestOffer?.marketplace_contract ?? OBJKT_CONTRACT)
        .then(setOffer);
    }, []);

    const buttonText = useMemo(() => {
      if (isOffersExisted) {
        if (isHolder) {
          return `Sell for ${highestOffer}`;
        } else {
          return 'Make offer';
        }
      } else {
        return 'No offers yet';
      }
    }, [isOffersExisted, isHolder, highestOffer]);

    const isListed = item.lowestAsk !== null;

    const handlePress = useCallback(async () => {
      if (!isHolder && isListed) {
        return navigateToObjktForBuy(collectionContract, item.id);
      }

      const getTransferParams = () => {
        if (isDefined(offer)) {
          if ('fulfill_offer' in offer?.methods) {
            return [offer.methods.fulfill_offer(item.highestOffer?.bigmap_key ?? 1, item.id).toTransferParams()];
          } else {
            return [offer.methods.offer_accept(item.highestOffer?.bigmap_key ?? 1).toTransferParams()];
          }
        }

        return [];
      };

      const transferParams = getTransferParams();

      const token = {
        id: item.id,
        symbol: item.symbol,
        standard: Route3TokenStandardEnum.fa2,
        contract: collectionContract,
        tokenId: `${item.id}`,
        decimals: item.decimals
      };

      const { approve, revoke } = await getTransferPermissions(
        tezos,
        item.highestOffer?.marketplace_contract ?? '',
        selectedPublicKeyHash,
        token,
        new BigNumber('0')
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
    }, []);

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={!isOffersExisted}
        style={[
          styles.sellButton,
          conditionalStyle(isOffersExisted, styles.sellButtonActive, styles.sellButtonDisabled)
        ]}
      >
        <Text
          style={[
            styles.sellButtonText,
            conditionalStyle(isOffersExisted, styles.sellButtonActive, styles.sellButtonDisabled)
          ]}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  }
);
