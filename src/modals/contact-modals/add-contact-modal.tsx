import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormAddressInput } from '../../form/form-address-input';
import { FormTextInput } from '../../form/form-text-input';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { addContactAction } from '../../store/contacts/contacts-actions';
import { Contact } from '../../store/contacts/contacts-state';
import { formatSize } from '../../styles/format-size';
import { useAddContactFormValidationSchema } from './validation-schema';

export const AddContactModal: FC = () => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();

  const addContactFormValidationSchema = useAddContactFormValidationSchema();

  const onSubmit = (contact: Contact) => {
    dispatch(addContactAction(contact));
    goBack();
  };

  return (
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={{ name: '', address: '' }}
      validationSchema={addContactFormValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode>
          <View>
            <Label label="Name" />
            <FormTextInput name="name" />
            <Label label="Address" />
            <FormAddressInput name="address" />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Save" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
