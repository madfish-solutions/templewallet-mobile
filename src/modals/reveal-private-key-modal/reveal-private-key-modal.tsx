import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { RevealAttention } from '../../components/reveal-attention/reveal-attention';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useHdAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import {
  RevealPrivateKeyModalFormValues,
  revealPrivateKeyModalValidationSchema
} from './reveal-private-key-modal.form';
import { RevealPrivateKeyView } from './reveal-private-key-view/reveal-private-key-view';

export const RevealPrivateKeyModal = () => {
  const account = useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealPrivateKey>>().params.account;

  const hdAccounts = useHdAccountsListSelector();

  const RevealPrivateKeyModalInitialValues: RevealPrivateKeyModalFormValues = { account };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealPrivateKeyModalValidationSchema}
      onSubmit={emptyFn}>
      {({ values }) => (
        <ScreenContainer>
          <Label
            label="Account"
            description="If you want to reveal a private key from another account - you should select it in the top-right dropdown."
          />
          <AccountFormDropdown name="account" list={hdAccounts} />
          <Label label="Private Key" description="Current account key. Keep it in secret." />
          <RevealPrivateKeyView publicKeyHash={values.account.publicKeyHash} />
          <Divider size={formatSize(16)} />
          <RevealAttention />
        </ScreenContainer>
      )}
    </Formik>
  );
};
