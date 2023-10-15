import BigNumber from 'bignumber.js';
import React, { memo, useMemo } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { objktCurrencies } from 'src/apis/objkt';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import {
  useCollectibleDetailsLoadingSelector,
  useCollectibleDetailsSelector
} from 'src/store/collectibles/collectibles-selectors';
import { UsableAccountAsset } from 'src/utils/assets/hooks';
import { formatNumber } from 'src/utils/format-price';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { Balance } from './balance';
import { CollectibleItemImage } from './item-image';
import { useCollectibleItemStyles } from './styles';

interface Props {
  slug: string;
  collectible: UsableAccountAsset;
  size: number;
  isShowInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleItem = memo<Props>(({ slug, collectible, size, isShowInfo = false, style }) => {
  const { navigate } = useNavigation();

  const handleNavigate = () => navigate(ModalsEnum.CollectibleModal, { slug });

  const styles = useCollectibleItemStyles();

  const areDetailsLoading = useCollectibleDetailsLoadingSelector();
  const details = useCollectibleDetailsSelector(slug);

  const balance = collectible.balance;

  const listing = useMemo(() => {
    const cheapestListing = details?.listingsActive[0];
    if (!cheapestListing) {
      return null;
    }

    const { price, currency_id } = cheapestListing;

    const currency = objktCurrencies[currency_id];
    if (!isDefined(currency)) {
      return null;
    }

    const floorPrice = +mutezToTz(new BigNumber(price), currency.decimals);
    const floorPriceDisplayed = formatNumber(floorPrice);

    return { floorPriceDisplayed, symbol: currency.symbol };
  }, [details]);

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleNavigate} style={[styles.root, style, { width: size }]}>
      <View style={[styles.image, { width: size, height: size }]}>
        <CollectibleItemImage
          slug={slug}
          size={size}
          artifactUri={collectible.artifactUri}
          // displayUri={collectible.displayUri ?? details?.displayUri}
          // mime={details?.mime}
          areDetailsLoading={areDetailsLoading && details === undefined}
        />

        {isShowInfo && isDefined(balance) ? <Balance balance={balance} /> : null}
      </View>

      {isShowInfo ? (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {collectible.name}
          </Text>

          <Text style={styles.price}>
            {listing ? `Floor: ${listing.floorPriceDisplayed} ${listing.symbol}` : 'Not listed'}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
});
