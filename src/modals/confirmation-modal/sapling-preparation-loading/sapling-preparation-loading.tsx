import React, { FC, memo, useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { PromotionItem } from 'src/components/promotion-item';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { cancelSaplingPreparationAction } from 'src/store/sapling/sapling-actions';

import { useSaplingPreparationLoadingStyles } from './sapling-preparation-loading.styles';

export const SaplingPreparationLoading: FC = memo(() => {
  const dispatch = useDispatch();
  const styles = useSaplingPreparationLoadingStyles();
  const { goBack } = useNavigation();

  const handleCancel = useCallback(() => {
    dispatch(cancelSaplingPreparationAction());
    goBack();
  }, [dispatch, goBack]);

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>Preparing your transaction.{'\n'}It could take time, usually around 1 minute.</Text>
        </View>

        <View style={styles.promotionContainer}>
          <PromotionItem
            id="sapling-preparation-promo"
            testID="saplingPreparationPromotion"
            pageName="SaplingPreparation"
            variant={PromotionVariantEnum.Text}
            shouldShowCloseButton
          />
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer>
        <ButtonLargeSecondary title="Cancel" onPress={handleCancel} />
      </ModalButtonsFloatingContainer>
    </>
  );
});
