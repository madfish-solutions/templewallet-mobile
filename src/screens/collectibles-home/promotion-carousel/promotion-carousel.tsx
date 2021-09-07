import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { PromotionCarouselItem } from './promotion-carousel-item/promotion-carousel-item';
import { promotionCarouselData } from './promotion-carousel.data';
import { usePromotionCarouselStyles } from './promotion-carousel.styles';

const windowSize = Dimensions.get('screen').width;
const sliderWidth = windowSize - 2 * formatSize(16);

export const PromotionCarousel = () => {
  const { navigate } = useNavigation();
  const styles = usePromotionCarouselStyles();

  const [activeDotIndex, setActiveDotIndex] = useState(0);

  return (
    <>
      <Carousel
        data={promotionCarouselData}
        windowSize={windowSize}
        itemWidth={sliderWidth}
        sliderWidth={sliderWidth}
        loop={true}
        autoplay={true}
        renderItem={item => (
          <PromotionCarouselItem backgroundColor={item.item.backgroundColor} emojisArray={item.item.emojisArray} />
        )}
        onSnapToItem={index => setActiveDotIndex(index)}
      />
      <Divider />
      <View style={styles.footer}>
        <Pagination
          dotsLength={promotionCarouselData.length}
          activeDotIndex={activeDotIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={styles.paginationInactiveDot}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
        <TouchableOpacity style={styles.walletNavigationButton} onPress={() => navigate(ScreensEnum.Wallet)}>
          <Text style={styles.walletNavigationButtonText}>To wallet</Text>
          <Icon name={IconNameEnum.ArrowRight} size={formatSize(10)} />
        </TouchableOpacity>
      </View>
    </>
  );
};
