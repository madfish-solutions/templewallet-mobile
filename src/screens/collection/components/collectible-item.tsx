import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { OBJKT_CONTRACT } from 'src/apis/objkt/constants';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
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
import { openUrl } from 'src/utils/linking.util';
import { formatAssetAmount } from 'src/utils/number.util';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { useCollectionStyles } from '../collection.styles';

const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

interface Props {
  item: TokenInterface;
  collectionContract: string;
  setWidth: (arg: number) => void;
}

export const CollectibleItem: FC<Props> = ({ item, collectionContract, setWidth }) => {
  const [offer, setOffer] = useState<ObjktContractInterface | FxHashContractInterface>();
  const selectedRpc = useSelectedRpcUrlSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createTezosToolkit(selectedRpc);
  const dispatch = useDispatch();

  const styles = useCollectionStyles();

  const { handleLayout, layoutWidth } = useLayoutSizes();

  useEffect(() => setWidth(layoutWidth), [layoutWidth]);

  useEffect(() => {
    tezos.contract
      .at<ObjktContractInterface | FxHashContractInterface>(item.highestOffer?.marketplace_contract ?? OBJKT_CONTRACT)
      .then(setOffer);
  }, []);

  const lastPrice = useMemo(() => {
    if (isDefined(item.lastPrice) && isDefined(item.lastPrice.price)) {
      const price = formatAssetAmount(mutezToTz(BigNumber(item.lastPrice?.price), item.lastPrice?.decimals));

      return `${price} ${item.lastPrice.symbol}`;
    }

    return '---';
  }, [item]);

  const highestOffer = isDefined(item.highestOffer)
    ? `${mutezToTz(BigNumber(item.highestOffer.price), item.decimals)} ${item.symbol}`
    : 'No offers yet';

  const holders = item?.holders?.filter(holder => holder.quantity > 0).map(holder => holder.holder_address) ?? [];
  const isHolder = holders.includes(selectedAccount.publicKeyHash);
  const isOffersExisted = isDefined(item.highestOffer);
  const isListed = item.lowestAsk !== null;
  const listedByUser = item.listed ?? 0;
  const quantityByUser =
    item?.holders?.find(holder => holder.holder_address === selectedAccount.publicKeyHash)?.quantity ?? 0;

  const isAbleToList = quantityByUser > listedByUser;

  const navigateToObjktForBuy = `https://objkt.com/asset/${collectionContract}/${item.id}`;

  const handlePress = async () => {
    if (!isHolder && isListed) {
      return openUrl(navigateToObjktForBuy);
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

  const handleList = () => openUrl(navigateToObjktForBuy);

  const buttonText = () => {
    if (isOffersExisted) {
      if (isHolder) {
        return `Sell for ${Number(highestOffer).toFixed(2)}`;
      } else {
        return 'Make offer';
      }
    } else {
      return 'No offers yet';
    }
  };

  return (
    <View style={styles.collectibleContainer} onLayout={handleLayout}>
      {isDefined(item.lowestAsk) && (
        <View style={styles.listed}>
          <Text style={styles.listedText}>LISTED</Text>
        </View>
      )}
      <View style={styles.collectible}>
        <View style={styles.topContainer}>
          <TouchableCollectibleIcon iconSize={CollectibleIconSize.BIG} collectible={item} size={formatSize(295)} />
          <Text style={styles.collectibleName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.collectibleDescription} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.containerRight}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Last Price</Text>
                <Text style={styles.value}>{lastPrice}</Text>
              </View>
            </View>
            <View style={styles.containerLeft}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Editions</Text>
                <Text style={styles.value}>{item.editions}</Text>
              </View>
            </View>
          </View>
        </View>
        {isHolder && (
          <View style={styles.buttonContainer}>
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
                {buttonText()}
              </Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                onPress={handleList}
                style={[
                  styles.sellButton,
                  conditionalStyle(!isAbleToList, styles.listButtonNotListed, styles.listButtonActive)
                ]}
                disabled={!isAbleToList}
              >
                <Text
                  style={[
                    styles.sellButtonText,
                    conditionalStyle(!isAbleToList, styles.listButtonDisabled, styles.listButtonActiveText)
                  ]}
                >
                  {!isAbleToList ? 'Listed' : 'List'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
