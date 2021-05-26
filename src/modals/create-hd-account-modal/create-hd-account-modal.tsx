import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormTextInput } from '../../form/form-text-input';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useHdAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { CreateHdAccountModalFormValues, createHdAccountModalValidationSchema } from './create-hd-account-modal.form';

export const CreateHdAccountModal = () => {
  const { createHdAccount } = useShelter();
  const { goBack } = useNavigation();

  const accountIndex = useHdAccountsListSelector().length + 1;

  const createHdAccountInitialValues: CreateHdAccountModalFormValues = {
    name: `Account ${accountIndex}`
  };

  const onSubmit = ({ name }: CreateHdAccountModalFormValues) => createHdAccount(name);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={createHdAccountInitialValues}
      validationSchema={createHdAccountModalValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Name" description="Call your account by any name you wish." />
            <FormTextInput name="name" />

            <Divider />
          </View>

          <ButtonsContainer>
            <ButtonLargeSecondary title="Close" marginRight={formatSize(16)} onPress={goBack} />
            <ButtonLargePrimary title="Save" onPress={submitForm} />
          </ButtonsContainer>
        </ScreenContainer>
      )}
    </Formik>
  );
};
