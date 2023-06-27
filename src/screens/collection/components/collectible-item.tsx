import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { useBuyCollectible } from 'src/hooks/use-buy-collectible.hook';
import { TouchableCollectibleIcon } from 'src/screens/collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';
import { OfferButton } from './offer-button';

interface Props {
  item: TokenInterface;
  collectionContract: string;
  selectedRpc: string;
  selectedPublicKeyHash: string;
}

export const CollectibleItem: FC<Props> = memo(({ item, collectionContract, selectedRpc, selectedPublicKeyHash }) => {
  const styles = useCollectibleItemStyles();

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
  const isHolder = useMemo(() => holders.includes(selectedPublicKeyHash), [selectedPublicKeyHash]);
  const isOffersExisted = isDefined(item.highestOffer);

  const listedByUser = item.listedAmount ?? 0;
  const quantityByUser = useMemo(
    () => item?.holders?.find(holder => holder.holder_address === selectedPublicKeyHash)?.quantity ?? 0,
    [selectedPublicKeyHash, item]
  );

  const isAbleToList = quantityByUser > listedByUser;
  const isListed = isNonEmptyArray(item.listing_active);

  const handleList = () => navigateToObjktForBuy(collectionContract, item.id);

  const { handleSubmit: handleBuy, purchaseCurrency } = useBuyCollectible(item.listing_active ?? [], item);

  const fxHashListed = item?.listing_active?.find(listing => listing.seller_address === selectedPublicKeyHash);

  const buttonText = useMemo(() => {
    if (isListed) {
      const price = mutezToTz(new BigNumber(purchaseCurrency.price), purchaseCurrency.decimals);

      return `buy for ${price} ${purchaseCurrency.symbol}`;
    }

    return 'Not listed';
  }, []);

  return (
    <View style={styles.collectibleContainer}>
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

        <View style={styles.buttonContainer}>
          <OfferButton
            isHolder={isHolder}
            isOffersExisted={isOffersExisted}
            highestOffer={highestOffer}
            item={item}
            selectedPublicKeyHash={selectedPublicKeyHash}
            selectedRpc={selectedRpc}
            collectionContract={collectionContract}
          />
          <View>
            {isHolder || !!fxHashListed ? (
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
            ) : (
              <TouchableOpacity
                style={[
                  styles.sellButton,
                  conditionalStyle(isListed, styles.listButtonActive, styles.listButtonNotListed)
                ]}
                onPress={handleBuy}
                disabled={!isListed}
              >
                <Text
                  style={[
                    styles.sellButtonText,
                    conditionalStyle(isListed, styles.listButtonActiveText, styles.listButtonDisabled)
                  ]}
                >
                  {buttonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});
