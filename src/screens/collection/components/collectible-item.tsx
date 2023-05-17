import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { OBJKT_CONTRACT } from 'src/apis/objkt/constants';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { FxHashContractInterface, ObjktContractInterface } from 'src/interfaces/marketplaces.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { TouchableCollectibleIcon } from 'src/screens/collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { valueToDecimals } from 'src/utils/number.util';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { useCollectionStyles } from '../collection.styles';

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

interface Props {
  item: TokenInterface;
  collectionContract: string;
}

export const CollectibleItem: FC<Props> = ({ item, collectionContract }) => {
  const [offer, setOffer] = useState<ObjktContractInterface | FxHashContractInterface>();
  const selectedRpc = useSelectedRpcUrlSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createTezosToolkit(selectedRpc);
  const dispatch = useDispatch();

  const styles = useCollectionStyles();

  useEffect(() => {
    tezos.contract
      .at<ObjktContractInterface | FxHashContractInterface>(item.highestOffer?.marketplace_contract ?? OBJKT_CONTRACT)
      .then(setOffer);
  }, []);

  const price = isDefined(item.lowestAsk) ? `${valueToDecimals(item.lowestAsk, item.decimals)} ${item.symbol}` : '---';
  const highestOffer = isDefined(item.highestOffer)
    ? `${valueToDecimals(item.highestOffer.price, item.decimals)} ${item.symbol}`
    : 'No offers yet';
  const holders = item?.holders?.map(holder => holder.holder_address) ?? [];
  const isHolder = holders.includes(selectedAccount.publicKeyHash);
  const isOffersExisted = isDefined(item.highestOffer);
  const isOfferFromUser = item.highestOffer?.buyer_address === selectedAccount.publicKeyHash;

  const handlePress = async () => {
    const transferParams = isDefined(offer)
      ? 'fulfill_offer' in offer?.methods
        ? [offer.methods.fulfill_offer(item.highestOffer?.bigmap_key ?? 1, item.id).toTransferParams()]
        : [offer.methods.offer_accept(item.highestOffer?.bigmap_key ?? 1).toTransferParams()]
      : [];

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
      selectedAccount.publicKeyHash,
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
    <View style={styles.collectibleContainer}>
      <View style={styles.collectible}>
        <TouchableCollectibleIcon iconSize={CollectibleIconSize.BIG} collectible={item} size={formatSize(285)} />
        <Text style={styles.collectibleName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.collectibleDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.containerRight}>
            <View style={styles.smallContainer}>
              <Text style={styles.text}>Floor Price</Text>
              <Text style={styles.value}>{price}</Text>
            </View>
          </View>
          <View style={styles.containerLeft}>
            <View style={styles.smallContainer}>
              <Text style={styles.text}>Editions</Text>
              <Text style={styles.value}>{item.editions}</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePress}
            disabled={!isOffersExisted || isOfferFromUser}
            style={[
              styles.sellButton,
              conditionalStyle(isOffersExisted && !isOfferFromUser, styles.sellButtonActive, styles.sellButtonDisabled)
            ]}
          >
            <Text
              style={[
                styles.sellButtonText,
                conditionalStyle(
                  isOffersExisted && !isOfferFromUser,
                  styles.sellButtonActive,
                  styles.sellButtonDisabled
                )
              ]}
            >
              {isHolder ? (isOffersExisted && !isOfferFromUser ? `Sell for ${highestOffer}` : 'No offers yet') : 'buy'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
