import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useMemo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ObjktOffer, getObjktMarketplaceContract, objktCurrencies } from 'src/apis/objkt';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';

interface Props {
  isHolder: boolean;
  objktOffer?: ObjktOffer;
  item: CollectionItemInterface;
  selectedPublicKeyHash: string;
  selectedRpc: string;
  collectionContract: string;
}

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

export const OfferButton: FC<Props> = memo(
  ({ isHolder, objktOffer, item, selectedPublicKeyHash, selectedRpc, collectionContract }) => {
    const styles = useCollectibleItemStyles();

    const dispatch = useDispatch();

    const tezos = useMemo(() => createTezosToolkit(selectedRpc), [selectedRpc]);

    const isOffersExisted = isDefined(objktOffer);

    const currency = objktCurrencies[objktOffer?.currency_id ?? 1];
    const decimals = currency?.decimals;
    const symbol = currency?.symbol ?? '???';
    const offerStr = isDefined(objktOffer)
      ? `${isDefined(decimals) ? mutezToTz(BigNumber(objktOffer.price), currency.decimals) : '???'} ${symbol}`
      : 'No offers yet';

    const buttonText = useMemo(() => {
      if (isOffersExisted) {
        if (isHolder) {
          return `Sell for ${offerStr}`;
        } else {
          return 'Make offer';
        }
      } else {
        return 'No offers yet';
      }
    }, [isOffersExisted, isHolder, offerStr]);

    const isListed = item.lowestAsk !== null;

    const handlePress = async () => {
      if (!isHolder && isListed) {
        return navigateToObjktForBuy(collectionContract, item.id);
      }

      const offer = await getObjktMarketplaceContract(tezos, objktOffer?.marketplace_contract).catch(error => {
        console.error(error);
      });

      const getTransferParams = () => {
        if (isDefined(offer)) {
          if ('fulfill_offer' in offer.methods) {
            return [offer.methods.fulfill_offer(objktOffer?.bigmap_key ?? 1, Number(item.id)).toTransferParams()];
          } else {
            return [offer.methods.offer_accept(objktOffer?.bigmap_key ?? 1).toTransferParams()];
          }
        }

        return [];
      };

      const transferParams = getTransferParams();

      const token = {
        id: item.id,
        symbol,
        standard: Route3TokenStandardEnum.fa2,
        contract: collectionContract,
        tokenId: `${item.id}`,
        decimals
      };

      const { approve, revoke } = await getTransferPermissions(
        tezos,
        objktOffer?.marketplace_contract ?? '',
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
    };

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
