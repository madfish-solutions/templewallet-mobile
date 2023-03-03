import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormTextInput } from '../../../form/form-text-input';
import { AccountBaseInterface } from '../../../interfaces/account.interface';
import { ModalsEnum, ModalsParamList } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { addContactAction, loadContactTezosBalance } from '../../../store/contact-book/contact-book-actions';
import { formatSize } from '../../../styles/format-size';
import { useAddContactFormValidationSchema } from '../validation-schema';
import { AddContactModalSelectors } from './add-contact-modal.selectors';

export const AddContactModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.AddContact>>();
  const validationSchema = useAddContactFormValidationSchema();

  const onSubmit = (contact: AccountBaseInterface) => {
    dispatch(addContactAction(contact));
    dispatch(loadContactTezosBalance.submit(contact.publicKeyHash));
    goBack();
  };

  const initialValues = {
    name: params?.name ?? '',
    publicKeyHash: params?.publicKeyHash ?? ''
  };

  return (
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode>
          <View>
            <Label label="Name" />
            <FormTextInput name="name" testID={AddContactModalSelectors.nameInput} />
            <Label label="Address" />
            <FormAddressInput name="publicKeyHash" testID={AddContactModalSelectors.addressInput} />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} testID={AddContactModalSelectors.closeButton} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Save"
                disabled={!isValid}
                onPress={submitForm}
                testID={AddContactModalSelectors.saveButton}
              />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
