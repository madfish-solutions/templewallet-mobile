import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types';
import React, { FC, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormTextInput } from 'src/form/form-text-input';
import { useDeleteContact } from 'src/hooks/use-delete-contact.hook';
import { Contact } from 'src/interfaces/contact.interface';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { editContactAction, loadContactTezosBalance } from 'src/store/contact-book/contact-book-actions';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isTezosContactAddress } from 'src/utils/contact.utils';
import { tezosDomainsResolver } from 'src/utils/dns.utils';

import { handleContactSubmission } from '../utils/handle-contact-submission.util';
import { useEditContactFormValidationSchema } from '../validation-schema';

import { EditContactModalSelectors } from './edit-contact-modal.selectors';
import { useEditContactModalStyles } from './edit-contact-modal.styles';

export const EditContactModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const styles = useEditContactModalStyles();
  const colors = useColors();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { contact, index } = useModalParams<ModalsEnum.EditContact>();
  const editContactFormValidationSchema = useEditContactFormValidationSchema(index);
  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  const resolver = useMemo(() => tezosDomainsResolver(), []);

  const formik = useRef<FormikProps<Contact>>(null);
  const deleteContact = useDeleteContact(goBack);

  const editContact = (contact: Contact) => {
    dispatch(editContactAction({ contact, index }));
    if (isTezosContactAddress(contact.address)) {
      dispatch(loadContactTezosBalance.submit(contact.address));
    }
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
        <>
          <ScreenContainer isFullScreenMode>
            <View>
              <Label label="Name" />
              <FormTextInput name="name" testID={EditContactModalSelectors.nameInput} />
              <Label label="Address" />
              <FormAddressInput
                name="address"
                placeholder="EVM or Tezos"
                testID={EditContactModalSelectors.addressInput}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteContact(contact)}
                testID={EditContactModalSelectors.deleteButton}
              >
                <IconV2 name={IconNameV2Enum.Trash} size={16} color={colors.destructive} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary
              title="Close"
              disabled={isLoading}
              onPress={goBack}
              testID={EditContactModalSelectors.closeButton}
            />
            <ButtonLargePrimary
              title="Save"
              disabled={!isValid || isLoading}
              onPress={submitForm}
              testID={EditContactModalSelectors.saveButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
