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
import { editContactAction, loadContactTezosBalance } from '../../../store/contact-book/contact-book-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/error-toast.utils';
import { isTezosDomainNameValid, tezosDomainsResolver } from '../../../utils/dns.utils';
import { isValidAddress } from '../../../utils/tezos.util';
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
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const resolver = tezosDomainsResolver(tezos);

  const formik = useRef<FormikProps<typeof contact>>(null);

  const onSubmit = async (contact: AccountBaseInterface) => {
    if (isTezosDomainNameValid(contact.publicKeyHash)) {
      setIsLoading(true);

      const address = await resolver.resolveNameToAddress(contact.publicKeyHash).catch(() => null);
      setIsLoading(false);
      if (address !== null) {
        contact.publicKeyHash = address;
        await formik.current?.validateField('publicKeyHash');
      } else if (!isValidAddress(contact.publicKeyHash)) {
        showErrorToast({ title: 'Error!', description: 'Your address has been expired' });

        return;
      }
    }

    if (formik.current && formik.current.isValid) {
      dispatch(editContactAction({ contact, index }));
      dispatch(loadContactTezosBalance.submit(contact.publicKeyHash));
      goBack();
    }
  };

  return (
    <Formik
      innerRef={formik}
      validateOnBlur
      validateOnChange
      initialValues={contact}
      validationSchema={editContactFormValidationSchema}
      onSubmit={onSubmit}
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
