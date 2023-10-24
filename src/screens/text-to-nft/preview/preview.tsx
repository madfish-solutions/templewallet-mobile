import { RouteProp, useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { OrderStatus } from 'src/apis/stable-diffusion/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Divider } from 'src/components/divider/divider';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { OFFSET_BETWEEN_ICONS, SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { CollectibleImage } from 'src/screens/text-to-nft/components/collectible-image/collectible-image';
import { CreateNftSelectors } from 'src/screens/text-to-nft/preview/selectors';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';

import { useOrderPreview } from '../generate-art/tabs/history/hooks/use-order-preview';
import { usePreviewStyles } from './preview.styles';

const ITEMS_PER_ROW = 4;
const LOADING_STATE_ORDER_VARIANTS = Array<string>(4).fill('');

export const PreviewScreen = memo(() => {
  const { orderId } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Preview>>().params;
  const { navigate } = useNavigation();
  const styles = usePreviewStyles();

  const order = useOrderPreview(orderId);
  const pending = order.status === OrderStatus.Pending;

  const orderVariants = useMemo(
    () => (isDefined(order.variants) ? order.variants : LOADING_STATE_ORDER_VARIANTS),
    [order]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const { width: windowWidth } = useWindowDimensions();
  const mainCollectibleSize = useMemo(
    () => (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS),
    [windowWidth]
  );

  const collectibleSize = useMemo(
    () =>
      (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
      OFFSET_BETWEEN_ICONS,
    [windowWidth]
  );

  const handleCreateNft = useCallback(
    () => navigate(ScreensEnum.MintNft, { imageUrl: orderVariants[activeIndex] }),
    [activeIndex, navigate, orderVariants]
  );

  return (
    <>
      <ScrollView style={styles.root}>
        <CollectibleImage
          uri={orderVariants[activeIndex]}
          size={mainCollectibleSize}
          showLoader={pending}
          iconSizeType={CollectibleIconSize.BIG}
          style={[styles.borderRadius, styles.marginBottom]}
        />

        <View style={styles.row}>
          {orderVariants.map((uri, index) => (
            <TouchableOpacity
              key={uri + index}
              onPress={() => setActiveIndex(index)}
              style={styles.imageContainer}
              testID={CreateNftSelectors.otherVariant}
            >
              <CollectibleImage
                uri={uri}
                size={collectibleSize}
                showLoader={pending}
                style={[styles.image, styles.borderRadius, conditionalStyle(index === activeIndex, styles.active)]}
              />

              <Text style={[styles.text, conditionalStyle(index === activeIndex, styles.activeText)]}>{`Variant ${
                index + 1
              }`}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Divider />
      </ScrollView>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Create NFT"
          onPress={handleCreateNft}
          disabled={pending}
          testID={CreateNftSelectors.submitButtonCreateNft}
        />
      </ButtonsFloatingContainer>
    </>
  );
});
