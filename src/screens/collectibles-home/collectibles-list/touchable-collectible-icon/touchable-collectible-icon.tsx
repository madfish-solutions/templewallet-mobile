import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CollectibleIconProps, CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { isDefined } from 'src/utils/is-defined';

import { currencyInfoById } from '../../../../apis/objkt/constants';
import { CollectibleIcon } from '../../../../components/collectible-icon/collectible-icon';
import { CollectibleInterface } from '../../../../token/interfaces/collectible-interfaces.interface';
import { formatNumber } from '../../../../utils/format-price';
import { mutezToTz } from '../../../../utils/tezos.util';
import { useTouchableCollectibleIconStyles } from './touchable-collectible-icon.styles';

type Props = Omit<CollectibleIconProps, 'collectible'> & {
  collectible: CollectibleInterface;
};

export const TouchableCollectibleIcon: FC<Props> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL,
  isShowInfo = false,
  style
}) => {
  const { navigate } = useNavigation();

  const handleNavigate = () =>
    navigate(ModalsEnum.CollectibleModal, {
      collectible
    });

  const styles = useTouchableCollectibleIconStyles();

  const name = collectible.name;

  const purchaseCurrency = useMemo(() => {
    if (isNonEmptyArray(collectible.listingsActive)) {
      const listing = collectible.listingsActive;
      const { price, currencyId } = listing[0];
      const currentCurrency = currencyInfoById[currencyId];

      return { price, ...currentCurrency };
    }

    return {
      price: 0,
      contract: null,
      decimals: 0,
      id: null,
      symbol: ''
    };
  }, [collectible]);

  const priceTitle = useMemo(() => {
    if (isNonEmptyArray(collectible.listingsActive)) {
      const price = mutezToTz(new BigNumber(purchaseCurrency.price), purchaseCurrency.decimals);

      return `Floor: ${formatNumber(+price)} ${purchaseCurrency.symbol}`;
    }

    return 'Not listed';
  }, [purchaseCurrency, collectible]);

  return isDefined(collectible) ? (
    <TouchableOpacity activeOpacity={1} onPress={handleNavigate} style={[styles.root, style]}>
      <CollectibleIcon
        iconSize={iconSize}
        collectible={collectible}
        size={size}
        isTouchableBlurOverlay={false}
        isShowInfo={isShowInfo}
      />
      {isShowInfo && (
        <View style={styles.description}>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
            {name}
          </Text>
          <Text style={styles.price}>{priceTitle}</Text>
        </View>
      )}
    </TouchableOpacity>
  ) : null;
};
