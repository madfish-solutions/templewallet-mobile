import { RouteProp, useRoute } from '@react-navigation/core';
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
import { IAccountBase } from '../../interfaces/account.interface';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { editContactAction } from '../../store/contacts/contacts-actions';
import { formatSize } from '../../styles/format-size';
import { editContactFormValidationSchema } from './validation-schema';

export const EditContactModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { name, publicKeyHash } = useRoute<RouteProp<ModalsParamList, ModalsEnum.EditContact>>().params;

  const onSubmit = (contact: IAccountBase) => {
    dispatch(editContactAction(contact));
    goBack();
  };

  return (
    <Formik
      validateOnBlur
      validateOnChange
      initialValues={{ name, publicKeyHash }}
      validationSchema={editContactFormValidationSchema}
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
