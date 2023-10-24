import { RouteProp, useRoute } from '@react-navigation/native';
import { FormikProvider, useFormik } from 'formik';
import React, { memo, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';
import { FormTextInput } from 'src/form/form-text-input';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { CollectibleImage } from 'src/screens/text-to-nft/components/collectible-image/collectible-image';
import { MintNftSelectors } from 'src/screens/text-to-nft/mint-nft/selectors';
import { formatSize } from 'src/styles/format-size';
import { showSuccessToast } from 'src/toast/toast.utils';

import { mintNftValidationSchema } from './mint-nft.form';
import { MintNftFormValues } from './mint-nft.interface';
import { useCreateNftStyles } from './mint-nft.styles';

export const MintNftScreen = memo(() => {
  const { imageUrl } = useRoute<RouteProp<ScreensParamList, ScreensEnum.MintNft>>().params;
  const styles = useCreateNftStyles();

  const { width: windowWidth } = useWindowDimensions();
  const mainCollectibleSize = useMemo(
    () => (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS),
    [windowWidth]
  );

  const handleSubmit = () => {
    showSuccessToast({ description: 'Minting ahead :)' });
  };

  const formik = useFormik<MintNftFormValues>({
    initialValues: {
      title: '',
      description: ''
    },
    validationSchema: mintNftValidationSchema,
    onSubmit: handleSubmit
  });

  const { submitForm } = formik;

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <Divider size={formatSize(16)} />

        <CollectibleImage
          uri={imageUrl}
          size={mainCollectibleSize}
          iconSizeType={CollectibleIconSize.BIG}
          style={styles.image}
        />
        <Divider size={formatSize(24)} />

        <Label label="Title" />
        <FormTextInput
          name="title"
          placeholder="Title of your NFT"
          style={styles.fontBody17Regular}
          testID={MintNftSelectors.titleInput}
        />

        <Label label="Description" />
        <FormTextInput
          multiline
          name="description"
          placeholder="Description of your NFT"
          testID={MintNftSelectors.descriptionInput}
          style={styles.descriptionInput}
        />

        <Label label="Tags" />
        <FormTextInput
          name="tag"
          placeholder="e.g. art"
          style={styles.fontBody17Regular}
          testID={MintNftSelectors.tagsInput}
        />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Mint NFT" onPress={submitForm} testID={MintNftSelectors.submitButtonCreateNft} />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
});
