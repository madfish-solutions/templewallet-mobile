import React from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { HeaderCard } from '../../components/header-card/header-card';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { CollectiblesHomeStyles } from './collectibles-home.styles';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

export const CollectiblesHome = () => {
  const colors = useColors();

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={CollectiblesHomeStyles.actionsContainer}>
          <TouchableIcon name={IconNameEnum.Search} onPress={emptyFn} />
          <TouchableIcon name={IconNameEnum.Hummer} color={colors.disabled} onPress={emptyFn} />
        </View>
        <Divider size={formatSize(16)} />
        <PromotionCarousel />
      </HeaderCard>
      <ScreenContainer>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
      </ScreenContainer>
    </>
  );
};
