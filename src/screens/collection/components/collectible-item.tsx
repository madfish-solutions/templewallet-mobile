import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { TouchableCollectibleIcon } from 'src/screens/collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';
import { formatAssetAmount } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { useCollectionStyles } from '../collection.styles';
import { navigateToObjktForBuy } from '../utils';
import { OfferButton } from './offer-button';

interface Props {
  item: TokenInterface;
  collectionContract: string;
  selectedRpc: string;
  selectedPublicKeyHash: string;
}

export const CollectibleItem: FC<Props> = memo(({ item, collectionContract, selectedRpc, selectedPublicKeyHash }) => {
  const styles = useCollectionStyles();

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
  const isHolder = holders.includes(selectedPublicKeyHash);
  const isOffersExisted = isDefined(item.highestOffer);

  const listedByUser = item.listed ?? 0;
  const quantityByUser = item?.holders?.find(holder => holder.holder_address === selectedPublicKeyHash)?.quantity ?? 0;

  const isAbleToList = quantityByUser > listedByUser;

  const handleList = () => openUrl(navigateToObjktForBuy(collectionContract, item.id));

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
        {isHolder && (
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
});
