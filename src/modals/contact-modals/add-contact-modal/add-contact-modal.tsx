import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types';
import React, { FC, useRef, useState } from 'react';
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
import { useReadOnlyTezosToolkit } from '../../../hooks/use-read-only-tezos-toolkit.hook';
import { AccountBaseInterface } from '../../../interfaces/account.interface';
import { ModalsEnum, ModalsParamList } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { addContactAction, loadContactTezosBalance } from '../../../store/contact-book/contact-book-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { tezosDomainsResolver } from '../../../utils/dns.utils';
import { handleContactSubmission } from '../utils/handle-contact-submission.util';
import { useAddContactFormValidationSchema } from '../validation-schema';
import { AddContactModalSelectors } from './add-contact-modal.selectors';

export const AddContactModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.AddContact>>();
  const validationSchema = useAddContactFormValidationSchema();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const resolver = tezosDomainsResolver(tezos);

  const formik = useRef<FormikProps<AccountBaseInterface>>(null);

  const addContact = (contact: AccountBaseInterface) => {
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
      innerRef={formik}
      validateOnBlur
      validateOnChange
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => handleContactSubmission(values, formik, resolver, setIsLoading, addContact)}
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
              <ButtonLargeSecondary
                title="Close"
                disabled={isLoading}
                onPress={goBack}
                testID={AddContactModalSelectors.closeButton}
              />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Save"
                disabled={!isValid || isLoading}
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
