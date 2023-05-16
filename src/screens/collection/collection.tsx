import { RouteProp, useRoute } from '@react-navigation/native';
import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ListRenderItem, ViewToken, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { OBJKT_CONTRACT } from 'src/apis/objkt/constants';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ObjktContractInterface } from 'src/interfaces/objkt.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
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

import { TouchableCollectibleIcon } from '../collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { useCollectionStyles } from './collection.styles';

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

export const Collection = () => {
  const styles = useCollectionStyles();
  const { metadata } = useNetworkInfo();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpc = useSelectedRpcUrlSelector();
  const tezos = createTezosToolkit(selectedRpc);
  const [offer, setOffer] = useState<ObjktContractInterface>();
  const dispatch = useDispatch();

  useEffect(() => {
    tezos.contract.at<ObjktContractInterface>(OBJKT_CONTRACT).then(setOffer);
  }, [tezos]);

  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const collectibles = useCollectibleByCollectionInfo(params.collectionContract);

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles.length);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    if (isDefined(info.viewableItems) && isDefined(info.viewableItems?.[0].index)) {
      setInnerScreenIndex(info.viewableItems[0].index);
    }
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = ({ item }) => {
    const price = isDefined(item.lowestAsk) ? `${valueToDecimals(item.lowestAsk, metadata.decimals)} TEZ` : '---';
    const highestOffer = isDefined(item.highestOffer)
      ? `${valueToDecimals(item.highestOffer.price_xtz, metadata.decimals)} TEZ`
      : 'No offers yet';
    const holders = item?.holders?.map(holder => holder.holder_address) ?? [];
    const isHolder = holders.includes(selectedAccount.publicKeyHash);
    const isOffersExisted = isDefined(item.highestOffer);
    const isOfferFromUser = item.highestOffer?.buyer_address === selectedAccount.publicKeyHash;

    const handlePress = async () => {
      const transferParams = isDefined(offer)
        ? [offer.methods.fulfill_offer(item.highestOffer?.bigmap_key ?? 1, item.id).toTransferParams()]
        : [];

      const token = {
        id: item.id,
        symbol: item.symbol,
        standard: Route3TokenStandardEnum.fa2,
        contract: params.collectionContract,
        tokenId: `${item.id}`,
        decimals: item.decimals
      };

      const { approve, revoke } = await getTransferPermissions(
        tezos,
        OBJKT_CONTRACT,
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
                conditionalStyle(
                  isOffersExisted && !isOfferFromUser,
                  styles.sellButtonActive,
                  styles.sellButtonDisabled
                )
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
                {isHolder
                  ? isOffersExisted && !isOfferFromUser
                    ? `Sell for ${highestOffer}`
                    : 'No offers yet'
                  : 'buy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={collectibles}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />
    </View>
  );
};
