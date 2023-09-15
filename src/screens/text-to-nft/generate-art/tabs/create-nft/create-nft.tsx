import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isString } from 'src/utils/is-string';
import { mutezToTz } from 'src/utils/tezos.util';

import { ArtStyle } from '../../components/art-style/art-style';
import { EnterPrompt } from '../../components/enter-prompt/enter-prompt';
import { GenerateArtSelectors } from '../../selectors';
import { generatingFeeAlert, removeFromImageAlert } from './alerts';
import { ART_STYLE_ITEMS, INSUFFICIENT_TEZOS_BALANCE_ERROR } from './constants';
import { CreateNftFormValues, createNftInitialValues, createNftValidationSchema } from './create-nft.form';
import { useCreateNftStyles } from './create-nft.styles';

const gridSize = formatSize(8);

export const CreateNft: FC = () => {
  const styles = useCreateNftStyles();
  const { navigate } = useNavigation();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [activeArtStyleId, setActiveArtStyleId] = useState(1);
  const [layoutWidth, setLayoutWidth] = useState(1);

  const tezosToken = useSelectedAccountTezosTokenSelector();

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setLayoutWidth(nativeEvent.layout.width || 1);
  }, []);

  const elementWidth = useMemo(() => (layoutWidth - gridSize) / 2, [layoutWidth]);

  const insufficientTezosBalance = useMemo(
    () => mutezToTz(new BigNumber(tezosToken.balance), tezosToken.decimals).lte(1),
    [tezosToken.balance]
  );

  const handleSubmit = (value: CreateNftFormValues) => {
    if (insufficientTezosBalance) {
      return showErrorToast({
        description: INSUFFICIENT_TEZOS_BALANCE_ERROR
      });
    }

    // TODO: Add error toast to limit 100 nft

    navigate(ModalsEnum.ConfirmSign, value);
  };

  return (
    <Formik initialValues={createNftInitialValues} validationSchema={createNftValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid, values, setFieldTouched, setFieldValue }) => {
        const handleSubmit = () => {
          if (!isString(values.positivePrompt.trim())) {
            setFieldTouched('positivePrompt', true, true);
            setFieldValue('positivePrompt', '');

            return;
          }

          submitForm();
        };

        return (
          <>
            <ScrollView style={styles.root}>
              <EnterPrompt
                title="What do you want to see?"
                name="positivePrompt"
                placeholder="Type in prompt"
                style={styles.positivePrompt}
              />

              <Checkbox
                value={isCheckboxChecked}
                onChange={setIsCheckboxChecked}
                size={formatSize(16)}
                testID={
                  isCheckboxChecked
                    ? GenerateArtSelectors.removeFromImageCheckboxOn
                    : GenerateArtSelectors.removeFromImageCheckboxOff
                }
              >
                <Divider size={formatSize(4)} />

                <Text style={styles.checkboxLabel}>Remove from image</Text>

                <TouchableIcon
                  onPress={removeFromImageAlert}
                  name={IconNameEnum.InfoFilled}
                  size={formatSize(24)}
                  testID={GenerateArtSelectors.removeFromImageAlert}
                />
              </Checkbox>

              {isCheckboxChecked && (
                <EnterPrompt
                  title="What you don`t want to see?"
                  name="negativePrompt"
                  placeholder="Type in negative prompt"
                  style={styles.nagativePrompt}
                />
              )}

              <View style={styles.section} onLayout={handleLayout}>
                <Text style={styles.title}>Art Style</Text>

                <View style={styles.artStyles}>
                  {ART_STYLE_ITEMS.map(({ id, title, disabled }) => (
                    <ArtStyle
                      key={id}
                      title={title}
                      width={elementWidth}
                      active={activeArtStyleId === id}
                      disabled={disabled}
                      onPress={() => setActiveArtStyleId(id)}
                      style={styles.artStyle}
                      testID={`${GenerateArtSelectors.pressArtStyle} ${title}`}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.title}>Operation Details</Text>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Variations number</Text>

                  <Text style={styles.detailsCount}>4</Text>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.align}>
                    <Text style={styles.detailsText}>Generating Fee</Text>

                    <TouchableIcon
                      onPress={generatingFeeAlert}
                      name={IconNameEnum.InfoFilled}
                      size={formatSize(24)}
                      testID={GenerateArtSelectors.generatingFeeAlert}
                    />
                  </View>

                  <Text style={styles.detailsCount}>0.00 TEZ</Text>
                </View>
              </View>

              <Divider size={formatSize(4)} />

              <Disclaimer
                title="Disclaimer"
                texts={[
                  <Text>
                    Please note that our Text to NFT service allows you to generate maximum 100 art variations per day,
                    which will be saved in the History section. Kindly ensure that you have a{' '}
                    <Text style={styles.boldText}>minimum balance of 10 TEZ</Text> before utilizing this service
                  </Text>
                ]}
              />

              <Divider size={formatSize(24)} />
            </ScrollView>

            <ButtonsFloatingContainer>
              <ButtonLargePrimary
                disabled={!isValid}
                title="Generate Art"
                onPress={handleSubmit}
                testID={GenerateArtSelectors.submitButtoGenerateNft}
              />
            </ButtonsFloatingContainer>
          </>
        );
      }}
    </Formik>
  );
};
