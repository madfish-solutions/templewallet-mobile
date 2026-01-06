import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types';
import React, { FC, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormTextInput } from 'src/form/form-text-input';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addContactAction, loadContactTezosBalance } from 'src/store/contact-book/contact-book-actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { tezosDomainsResolver } from 'src/utils/dns.utils';

import { handleContactSubmission } from '../utils/handle-contact-submission.util';
import { useAddContactFormValidationSchema } from '../validation-schema';

import { AddContactModalSelectors } from './add-contact-modal.selectors';

export const AddContactModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.AddContact>>();
  const validationSchema = useAddContactFormValidationSchema();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolver = useMemo(() => tezosDomainsResolver(selectedRpcUrl), [selectedRpcUrl]);

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

  usePageAnalytic(ModalsEnum.AddContact);

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
