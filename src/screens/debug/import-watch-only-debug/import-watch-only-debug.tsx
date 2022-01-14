import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { AccountTypeEnum } from '../../../enums/account-type.enum';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormTextInput } from '../../../form/form-text-input';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { addHdAccountAction, setSelectedAccountAction } from '../../../store/wallet/wallet-actions';
import { showSuccessToast } from '../../../toast/toast.utils';
import {
  importWatchOnlyDebugInitialValues,
  importWatchOnlyDebugValidationSchema,
  ImportWatchOnlyDebugValues
} from './import-watch-only-debug.form';

export const ImportWatchOnlyDebug: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const onSubmit = (values: ImportWatchOnlyDebugValues) => {
    const publicData = {
      name: values.name,
      type: AccountTypeEnum.WATCH_ONLY_DEBUG,
      publicKey: 'publicKey',
      publicKeyHash: values.address
    };

    dispatch(setSelectedAccountAction(publicData.publicKeyHash));
    dispatch(addHdAccountAction(publicData));
    showSuccessToast({ description: 'Debug Account Imported!' });
    goBack();
  };

  return (
    <Formik
      initialValues={importWatchOnlyDebugInitialValues}
      validationSchema={importWatchOnlyDebugValidationSchema}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <View>
          <FormTextInput name="name" placeholder="Account name" />
          <Divider />
          <FormAddressInput name="address" placeholder="Address" />
          <Divider />
          <ButtonLargePrimary title="Import" disabled={!isValid} onPress={submitForm} />
        </View>
      )}
    </Formik>
  );
};
