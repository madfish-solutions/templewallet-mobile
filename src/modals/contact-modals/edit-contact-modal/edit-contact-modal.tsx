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
import { editContactAction, loadContactTezosBalance } from 'src/store/contact-book/contact-book-actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { tezosDomainsResolver } from 'src/utils/dns.utils';

import { handleContactSubmission } from '../utils/handle-contact-submission.util';
import { useEditContactFormValidationSchema } from '../validation-schema';

import { EditContactModalSelectors } from './edit-contact-modal.selectors';

export const EditContactModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const {
    params: { contact, index }
  } = useRoute<RouteProp<ModalsParamList, ModalsEnum.EditContact>>();
  const editContactFormValidationSchema = useEditContactFormValidationSchema(index);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolver = useMemo(() => tezosDomainsResolver(selectedRpcUrl), [selectedRpcUrl]);

  const formik = useRef<FormikProps<AccountBaseInterface>>(null);

  const editContact = (contact: AccountBaseInterface) => {
    dispatch(editContactAction({ contact, index }));
    dispatch(loadContactTezosBalance.submit(contact.publicKeyHash));
    goBack();
  };

  usePageAnalytic(ModalsEnum.EditContact);

  return (
    <Formik
      innerRef={formik}
      validateOnBlur
      validateOnChange
      initialValues={contact}
      validationSchema={editContactFormValidationSchema}
      onSubmit={values => handleContactSubmission(values, formik, resolver, setIsLoading, editContact)}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode>
          <View>
            <Label label="Name" />
            <FormTextInput name="name" testID={EditContactModalSelectors.nameInput} />
            <Label label="Address" />
            <FormAddressInput name="publicKeyHash" testID={EditContactModalSelectors.addressInput} />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary
                title="Close"
                disabled={isLoading}
                onPress={goBack}
                testID={EditContactModalSelectors.closeButton}
              />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Save"
                disabled={!isValid || isLoading}
                onPress={submitForm}
                testID={EditContactModalSelectors.saveButton}
              />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
