import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormTextInput } from 'src/form/form-text-input';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadScamlistAction, loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { showSuccessToast } from 'src/toast/toast.utils';

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
    dispatch(loadWhitelistAction.submit());
    dispatch(loadScamlistAction.submit());
    showSuccessToast({ description: 'Debug Account Imported!' });
    goBack();
  };

  return (
    <Formik
      initialValues={importWatchOnlyDebugInitialValues}
      validationSchema={importWatchOnlyDebugValidationSchema}
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <View>
          <FormTextInput name="name" placeholder="Account name" />
          <FormAddressInput name="address" placeholder="Address" />
          <ButtonLargePrimary title="Import" disabled={!isValid} onPress={submitForm} />
        </View>
      )}
    </Formik>
  );
};
