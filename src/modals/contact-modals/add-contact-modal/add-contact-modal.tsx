import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types';
import React, { FC, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormTextInput } from 'src/form/form-text-input';
import { Contact } from 'src/interfaces/contact.interface';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { addContactAction } from 'src/store/contact-book/contact-book-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { tezosDomainsResolver } from 'src/utils/dns.utils';

import { handleContactSubmission } from '../utils/handle-contact-submission.util';
import { useAddContactFormValidationSchema } from '../validation-schema';

import { AddContactModalSelectors } from './add-contact-modal.selectors';

export const AddContactModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { goBack } = useNavigation();
  const params = useModalParams<ModalsEnum.AddContact>();
  const validationSchema = useAddContactFormValidationSchema();
  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  const resolver = useMemo(() => tezosDomainsResolver(), []);

  const formik = useRef<FormikProps<Contact>>(null);

  const addContact = (contact: Contact) => {
    dispatch(addContactAction(contact));
    goBack();
  };

  const initialValues = {
    name: params?.name ?? '',
    address: params?.address ?? ''
  };

  usePageAnalytic(ModalsEnum.AddContact);

  return (
    <Formik
      validateOnChange
      innerRef={formik}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => handleContactSubmission(values, formik, resolver, setIsLoading, addContact)}
    >
      {({ submitForm, isValid, submitCount }) => (
        <>
          <ScreenContainer isFullScreenMode>
            <View>
              <Label label="Name" />
              <FormTextInput name="name" testID={AddContactModalSelectors.nameInput} />
              <Label label="Address" />
              <FormAddressInput
                name="address"
                placeholder="EVM or Tezos"
                testID={AddContactModalSelectors.addressInput}
              />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary title="Close" onPress={goBack} testID={AddContactModalSelectors.closeButton} />
            <ButtonLargePrimary
              title="Save"
              isLoading={isLoading}
              disabled={submitCount !== 0 && (!isValid || isLoading)}
              onPress={submitForm}
              testID={AddContactModalSelectors.saveButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
